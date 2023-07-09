CREATE DATABASE fmetal character set utf8mb4 collate utf8mb4_unicode_ci;

USE fmetal;

CREATE TABLE PRODUCTS (
	code INT PRIMARY KEY,
	link VARCHAR(250)
);

CREATE TABLE IMAGES (
	id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    size INT NOT NULL,
    main BOOLEAN NOT NULL
);

CREATE TABLE IMGLOCATIONS (
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    size INT NOT NULL,
    storehouse VARCHAR(150) NOT NULL,
    street VARCHAR(100),
    side VARCHAR(100),
    shelf VARCHAR(100),
    column_name VARCHAR(100),
    description VARCHAR(250)
);

CREATE TABLE IMGPRODUCTS (
	product_id INT,
    image_id INT,
    createdBy VARCHAR(200) NOT NULL,
    updatedBy Varchar(200),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateddAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id, image_id),
    FOREIGN KEY (product_id) REFERENCES PRODUCTS(code),
    FOREIGN KEY (image_id) REFERENCES IMAGES(id)
);

CREATE TABLE IMGPRODUCTSLOCATIONS (
	product_id INT,
    img_location_id INT,
    createdBy VARCHAR(250) NOT NULL,
    updatedBy VARCHAR(250),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id, img_location_id),
	FOREIGN KEY (product_id) REFERENCES PRODUCTS(code),
    FOREIGN KEY (img_location_id) REFERENCES IMGLOCATIONS(id)
);