1: 
CREATE DATABASE managecustomer;

2: 
use managecustomer;

3: 
CREATE TABLE customer (
  customer_id int primary key,
  customer_age varchar(5),
  customer_birthday date,
  customer_contact varchar(50) NOT NULL,
  customer_hobby varchar(100) DEFAULT NULL,
  customer_isblack boolean NOT NULL DEFAULT false,
  customer_isgiven boolean NOT NULL DEFAULT false,
  customer_name varchar(30) NOT NULL,
  customer_place varchar(50),
  customer_register_date date NOT NULL,
  customer_updated_date date NOT NULL
);

4: 
CREATE TABLE song (
  song_id int primary key,
  song_memo varchar(300),
  song_name varchar(30) NOT NULL,
  customer_id int NOT NULL,
  song_register_date date NOT NULL,
  song_updated_date date NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customer (customer_id)
);
