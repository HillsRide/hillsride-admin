-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `employee_id` VARCHAR(191) NOT NULL,
    `designation` VARCHAR(255) NOT NULL,
    `department` VARCHAR(255) NOT NULL,
    `manager` VARCHAR(255) NOT NULL,
    `approver` VARCHAR(255) NOT NULL,
    `password` VARCHAR(191) NULL DEFAULT 'Admin@123',
    `pin` VARCHAR(191) NULL,
    `auth_code` VARCHAR(100) NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    `needsPasswordChange` BOOLEAN NOT NULL DEFAULT true,
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_employee_id_key`(`employee_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SystemSetting` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SystemSetting_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SearchHistory` (
    `id` VARCHAR(191) NOT NULL,
    `search_query` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `search_count` INTEGER NOT NULL DEFAULT 1,
    `first_searched` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_searched` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_type` VARCHAR(191) NOT NULL DEFAULT 'guest',
    `device` VARCHAR(191) NULL,
    `is_successful` BOOLEAN NOT NULL DEFAULT true,
    `converted_to_booking` BOOLEAN NOT NULL DEFAULT false,
    `booking_id` VARCHAR(191) NULL,
    `user_id` INTEGER NULL,
    `session_id` VARCHAR(191) NULL,
    `source_page` VARCHAR(191) NULL,
    `search_category` VARCHAR(191) NULL,
    `estimated_distance` DOUBLE NULL,
    `estimated_duration` INTEGER NULL,
    `peak_hour_search` BOOLEAN NOT NULL DEFAULT false,
    `region` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `search_completion_rate` DOUBLE NULL,
    `user_agent` TEXT NULL,
    `ip_address` VARCHAR(191) NULL,
    `referral_source` VARCHAR(191) NULL,
    `time_to_result` INTEGER NULL,
    `competitor_price_check` BOOLEAN NOT NULL DEFAULT false,
    `potential_revenue` DOUBLE NULL,
    `seasonal_factor` DOUBLE NULL,
    `market_demand_score` INTEGER NULL,

    INDEX `SearchHistory_search_query_idx`(`search_query`),
    INDEX `SearchHistory_search_count_idx`(`search_count`),
    INDEX `SearchHistory_converted_to_booking_idx`(`converted_to_booking`),
    INDEX `SearchHistory_search_category_idx`(`search_category`),
    INDEX `SearchHistory_region_city_state_idx`(`region`, `city`, `state`),
    INDEX `SearchHistory_first_searched_last_searched_idx`(`first_searched`, `last_searched`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LocationDemandAnalytics` (
    `id` VARCHAR(191) NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `total_searches` INTEGER NOT NULL DEFAULT 0,
    `successful_bookings` INTEGER NOT NULL DEFAULT 0,
    `revenue_generated` DOUBLE NOT NULL DEFAULT 0,
    `peak_hours` JSON NULL,
    `popular_routes` JSON NULL,
    `average_fare` DOUBLE NULL,
    `demand_score` INTEGER NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LocationDemandAnalytics_region_city_state_key`(`region`, `city`, `state`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PricingAnalytics` (
    `id` VARCHAR(191) NOT NULL,
    `route_hash` VARCHAR(191) NOT NULL,
    `base_price` DOUBLE NOT NULL,
    `surge_multiplier` DOUBLE NOT NULL DEFAULT 1.0,
    `peak_hour_rate` DOUBLE NULL,
    `off_peak_rate` DOUBLE NULL,
    `competitor_price` DOUBLE NULL,
    `success_rate` DOUBLE NULL,
    `last_updated` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PricingAnalytics_route_hash_key`(`route_hash`),
    INDEX `PricingAnalytics_route_hash_idx`(`route_hash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL DEFAULT 'Assam',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Route` (
    `id` VARCHAR(191) NOT NULL,
    `originId` VARCHAR(191) NOT NULL,
    `destinationId` VARCHAR(191) NOT NULL,
    `directionType` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stop` (
    `id` VARCHAR(191) NOT NULL,
    `routeId` VARCHAR(191) NOT NULL,
    `locationId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `distanceKm` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RouteFare` (
    `id` VARCHAR(191) NOT NULL,
    `routeId` VARCHAR(191) NOT NULL,
    `vehicleType` VARCHAR(191) NOT NULL,
    `pricingType` VARCHAR(191) NOT NULL,
    `baseFare` DOUBLE NOT NULL,
    `perKmRate` DOUBLE NULL,
    `perHourRate` DOUBLE NULL,
    `nightCharge` DOUBLE NULL,
    `hillCharge` DOUBLE NULL,
    `waitingCharge` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RouteAvailability` (
    `id` VARCHAR(191) NOT NULL,
    `routeId` VARCHAR(191) NOT NULL,
    `vehicleType` VARCHAR(191) NOT NULL,
    `isAvailable` BOOLEAN NOT NULL DEFAULT true,
    `reason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SearchHistory` ADD CONSTRAINT `SearchHistory_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Route` ADD CONSTRAINT `Route_originId_fkey` FOREIGN KEY (`originId`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Route` ADD CONSTRAINT `Route_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stop` ADD CONSTRAINT `Stop_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `Route`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stop` ADD CONSTRAINT `Stop_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RouteFare` ADD CONSTRAINT `RouteFare_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `Route`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RouteAvailability` ADD CONSTRAINT `RouteAvailability_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `Route`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

