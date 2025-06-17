public interface CacheService {
    <T> T get(String key, Class<T> type);
    void put(String key, Object value);
    void evict(String key);
}

public abstract class CacheableRepository<T, ID> {

    protected final CacheService cacheService;

    protected CacheableRepository(CacheService cacheService) {
        this.cacheService = cacheService;
    }

    /**
     * Compose your cache key for this entity type
     */
    protected abstract String buildCacheKey(ID id);

    /**
     * Fetch from DB (each repo knows its DB logic)
     */
    protected abstract T fetchFromDb(ID id);

    /**
     * Class type for deserialization (if needed)
     */
    protected abstract Class<T> getTypeClass();

    /**
     * Common method to get from cache or DB
     */
    public T getByIdWithCache(ID id) {
        String key = buildCacheKey(id);

        // 1️⃣ Try cache
        T value = cacheService.get(key, getTypeClass());
        if (value != null) {
            return value;
        }

        // 2️⃣ Fallback to DB
        value = fetchFromDb(id);
        if (value != null) {
            cacheService.put(key, value);
        }

        return value;
    }

    /**
     * Optional cache clear
     */
    public void evictCache(ID id) {
        cacheService.evict(buildCacheKey(id));
    }
}




@Repository
public class UserRepository extends CacheableRepository<User, Long> {

    private final UserJpaRepository userJpaRepository;

    @Autowired
    public UserRepository(CacheService cacheService, UserJpaRepository userJpaRepository) {
        super(cacheService);
        this.userJpaRepository = userJpaRepository;
    }

    @Override
    protected String buildCacheKey(Long id) {
        return "user:" + id;
    }

    @Override
    protected User fetchFromDb(Long id) {
        return userJpaRepository.findById(id).orElse(null);
    }

    @Override
    protected Class<User> getTypeClass() {
        return User.class;
    }
}


@Autowired
private UserRepository userRepository;

public void someBusinessLogic() {
    User user = userRepository.getByIdWithCache(42L);
    if (user != null) {
        System.out.println("Fetched user: " + user.getName());
    }
}



import com.fasterxml.jackson.databind.ObjectMapper;
import com.hazelcast.core.HazelcastInstance;
import com.hazelcast.map.IMap;
import org.springframework.stereotype.Service;

@Service
public class HazelcastCacheService implements CacheService {

    private final HazelcastInstance hazelcastInstance;
    private final ObjectMapper objectMapper;
    private final String MAP_NAME = "my-app-cache"; // You can parametrize this if needed

    public HazelcastCacheService(HazelcastInstance hazelcastInstance, ObjectMapper objectMapper) {
        this.hazelcastInstance = hazelcastInstance;
        this.objectMapper = objectMapper;
    }

    @Override
    public <T> T get(String key, Class<T> type) {
        IMap<String, String> map = hazelcastInstance.getMap(MAP_NAME);
        String json = map.get(key);
        if (json == null) {
            return null;
        }
        try {
            return objectMapper.readValue(json, type);
        } catch (Exception e) {
            throw new RuntimeException("Failed to deserialize cache value for key: " + key, e);
        }
    }

    @Override
    public void put(String key, Object value) {
        IMap<String, String> map = hazelcastInstance.getMap(MAP_NAME);
        try {
            String json = objectMapper.writeValueAsString(value);
            map.put(key, json);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize value for cache key: " + key, e);
        }
    }

    @Override
    public void evict(String key) {
        IMap<String, String> map = hazelcastInstance.getMap(MAP_NAME);
        map.delete(key);
    }
}



@Repository
public class UserRepository extends CacheableRepository<User, Long> {

    private final UserJpaRepository userJpaRepository;

    @Autowired
    public UserRepository(CacheService cacheService, UserJpaRepository userJpaRepository) {
        super(cacheService);
        this.userJpaRepository = userJpaRepository;
    }

    @Override
    protected String buildCacheKey(Long id) {
        return "user:" + id;
    }

    @Override
    protected User fetchFromDb(Long id) {
        return userJpaRepository.findById(id).orElse(null);
    }

    @Override
    protected Class<User> getTypeClass() {
        return User.class;
    }
}
