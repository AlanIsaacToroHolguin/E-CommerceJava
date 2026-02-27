package com.javaecommerce.config;

import com.javaecommerce.entity.*;
import com.javaecommerce.repository.CategoryRepository;
import com.javaecommerce.repository.ProductRepository;
import com.javaecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    // Local images served by the frontend from /frontend/public/guitars/<file>
    private static final String IMG_FENDER_PRO_STRAT  = "/guitars/fender-american-pro-ii-strat.png";
    private static final String IMG_FENDER_HSS        = "/guitars/fender-player-strat-hss.png";
    private static final String IMG_SQUIER_50S        = "/guitars/squier-classic-vibe-50s-strat.png";
    private static final String IMG_GIBSON_LP         = "/guitars/gibson-les-paul-standard-60s.png";
    private static final String IMG_EPIPHONE_LP       = "/guitars/epiphone-les-paul-standard-50s.png";
    private static final String IMG_FENDER_PRO_TELE   = "/guitars/fender-american-pro-ii-tele.png";
    private static final String IMG_FENDER_PLAYER_TELE = "/guitars/fender-player-tele.png";
    private static final String IMG_GIBSON_SG         = "/guitars/gibson-sg-standard.png";
    private static final String IMG_EPIPHONE_SG       = "/guitars/epiphone-sg-special.png";
    private static final String IMG_IBANEZ_RG550      = "/guitars/ibanez-rg550-genesis.png";
    private static final String IMG_JACKSON_SOLOIST   = "/guitars/jackson-pro-plus-soloist.png";
    private static final String IMG_ESP_M1000         = "/guitars/esp-ltd-m1000-evertune.png";

    // Category covers reuse one product photo from each series
    private static final String CAT_STRAT       = IMG_FENDER_PRO_STRAT;
    private static final String CAT_LES_PAUL    = IMG_GIBSON_LP;
    private static final String CAT_TELECASTER  = IMG_FENDER_PRO_TELE;
    private static final String CAT_SG          = IMG_GIBSON_SG;
    private static final String CAT_SUPERSTRAT  = IMG_JACKSON_SOLOIST;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedCustomer();
        if (productRepository.count() == 0) {
            seedCatalog();
        }
    }

    private void seedAdmin() {
        if (userRepository.existsByEmail("admin@guitarshop.com")) return;
        User admin = User.builder()
                .email("admin@guitarshop.com")
                .password(passwordEncoder.encode("admin12345"))
                .firstName("Store")
                .lastName("Admin")
                .role(Role.ADMIN)
                .enabled(true)
                .build();
        admin.setCart(Cart.builder().user(admin).build());
        userRepository.save(admin);
        log.info("Seeded admin: admin@guitarshop.com / admin12345");
    }

    private void seedCustomer() {
        if (userRepository.existsByEmail("customer@guitarshop.com")) return;
        User c = User.builder()
                .email("customer@guitarshop.com")
                .password(passwordEncoder.encode("customer12345"))
                .firstName("Demo")
                .lastName("Customer")
                .role(Role.CUSTOMER)
                .enabled(true)
                .build();
        c.setCart(Cart.builder().user(c).build());
        userRepository.save(c);
        log.info("Seeded customer: customer@guitarshop.com / customer12345");
    }

    private void seedCatalog() {
        Category strat = upsertCategory("Stratocaster",
                "Double-cutaway, three single-coil pickups, classic bright tone.",
                CAT_STRAT);
        Category lp = upsertCategory("Les Paul",
                "Single-cutaway, mahogany body, dual humbuckers, thick warm tone.",
                CAT_LES_PAUL);
        Category tele = upsertCategory("Telecaster",
                "Solid body, twangy and articulate, country and rock staple.",
                CAT_TELECASTER);
        Category sg = upsertCategory("SG",
                "Lightweight mahogany body, double cutaway, aggressive humbucker tone.",
                CAT_SG);
        Category superstrat = upsertCategory("Superstrat",
                "High-output pickups, fast necks, built for shred and modern metal.",
                CAT_SUPERSTRAT);

        productRepository.saveAll(List.of(
                guitar("Fender American Professional II Stratocaster", "Fender", "0113900706", strat,
                        new BigDecimal("1899.00"), 8, "Olympic White", "Alder", "Maple", "Rosewood", "SSS",
                        IMG_FENDER_PRO_STRAT,
                        "Workhorse Strat with V-Mod II single-coils, Deep C neck and rolled fingerboard edges."),
                guitar("Fender Player Stratocaster HSS", "Fender", "0144523506", strat,
                        new BigDecimal("899.00"), 15, "3-Color Sunburst", "Alder", "Maple", "Pau Ferro", "HSS",
                        IMG_FENDER_HSS,
                        "Modern Player series HSS with Player Series Alnico V pickups and 2-point tremolo."),
                guitar("Squier Classic Vibe '50s Stratocaster", "Squier", "0374005506", strat,
                        new BigDecimal("499.00"), 25, "2-Color Sunburst", "Pine", "Maple", "Maple", "SSS",
                        IMG_SQUIER_50S,
                        "Vintage-style Strat with Fender-designed alnico pickups and slim '50s C neck."),

                guitar("Gibson Les Paul Standard '60s", "Gibson", "LPS600HCNH1", lp,
                        new BigDecimal("2799.00"), 6, "Bourbon Burst", "Mahogany w/ Maple top", "Mahogany", "Rosewood", "HH",
                        IMG_GIBSON_LP,
                        "Classic '60s Burstbucker 61R/61T pickups, SlimTaper neck, AAA flame maple top."),
                guitar("Epiphone Les Paul Standard '50s", "Epiphone", "EILS5HSNH1", lp,
                        new BigDecimal("699.00"), 18, "Heritage Cherry Sunburst", "Mahogany w/ Maple top", "Mahogany", "Indian Laurel", "HH",
                        IMG_EPIPHONE_LP,
                        "Affordable Les Paul with ProBucker pickups, '50s rounded neck and CTS pots."),

                guitar("Fender American Pro II Telecaster", "Fender", "0113942700", tele,
                        new BigDecimal("1799.00"), 7, "Butterscotch Blonde", "Ash", "Maple", "Maple", "SS",
                        IMG_FENDER_PRO_TELE,
                        "V-Mod II single-coils, treble-bleed circuit and compound-radius fingerboard."),
                guitar("Fender Player Telecaster", "Fender", "0145212500", tele,
                        new BigDecimal("849.00"), 14, "Black", "Alder", "Maple", "Maple", "SS",
                        IMG_FENDER_PLAYER_TELE,
                        "Solid alder body, Player Alnico V Tele pickups, modern C neck profile."),

                guitar("Gibson SG Standard", "Gibson", "SGS00HCCH1", sg,
                        new BigDecimal("1799.00"), 5, "Heritage Cherry", "Mahogany", "Mahogany", "Rosewood", "HH",
                        IMG_GIBSON_SG,
                        "Lightweight mahogany SG with 490R/490T humbuckers and rounded neck profile."),
                guitar("Epiphone SG Special", "Epiphone", "EGS1VECH1", sg,
                        new BigDecimal("349.00"), 22, "Vintage Cherry", "Mahogany", "Mahogany", "Indian Laurel", "HH",
                        IMG_EPIPHONE_SG,
                        "Entry SG with Epiphone Ceramic Pro humbuckers, lightweight body and SlimTaper D neck."),

                guitar("Ibanez RG550 Genesis Collection", "Ibanez", "RG550DY", superstrat,
                        new BigDecimal("1199.00"), 9, "Desert Sun Yellow", "Basswood", "Maple", "Maple", "HSH",
                        IMG_IBANEZ_RG550,
                        "Genesis reissue: Wizard neck, V7/S1/V8 pickups and Edge tremolo bridge."),
                guitar("Jackson Pro Plus Soloist SLA3", "Jackson", "2914327503", superstrat,
                        new BigDecimal("1499.00"), 5, "Deep Black Satin", "Mahogany", "Maple", "Ebony", "HH",
                        IMG_JACKSON_SOLOIST,
                        "Through-body neck, Seymour Duncan JB/Jazz, Floyd Rose 1500 Series tremolo."),
                guitar("ESP LTD M-1000 Evertune", "ESP", "LM1000ETHTM", superstrat,
                        new BigDecimal("1399.00"), 4, "Charcoal Metallic Satin", "Mahogany", "Maple", "Macassar Ebony", "HH",
                        IMG_ESP_M1000,
                        "Evertune bridge, Fishman Fluence Modern pickups, perfect tuning under any tension.")
        ));
        log.info("Seeded {} categories and {} guitars", categoryRepository.count(), productRepository.count());
    }

    private Category upsertCategory(String name, String description, String imageUrl) {
        return categoryRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> categoryRepository.save(Category.builder()
                        .name(name).description(description).imageUrl(imageUrl).build()));
    }

    private Product guitar(String name, String brand, String code, Category cat,
                           BigDecimal price, int stock, String color, String body, String neck,
                           String fb, String pickups, String img, String desc) {
        return Product.builder()
                .name(name).brand(brand).modelCode(code).category(cat)
                .price(price).stock(stock).color(color)
                .bodyWood(body).neckWood(neck).fingerboard(fb).pickupConfig(pickups)
                .imageUrl(img).description(desc).active(true)
                .build();
    }
}
