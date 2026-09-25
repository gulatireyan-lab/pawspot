CREATE TABLE IF NOT EXISTS grooming_centers (
 id BIGSERIAL PRIMARY KEY,name TEXT NOT NULL,city TEXT NOT NULL,area TEXT NOT NULL,address TEXT NOT NULL,phone TEXT,
 rating NUMERIC(2,1),review_count INTEGER,price_from INTEGER,service_type TEXT NOT NULL DEFAULT 'salon',
 services TEXT NOT NULL,description TEXT,source_name TEXT,source_url TEXT,verified_status TEXT NOT NULL DEFAULT 'public-source',
 created_at TIMESTAMP NOT NULL DEFAULT now(),updated_at TIMESTAMP NOT NULL DEFAULT now());