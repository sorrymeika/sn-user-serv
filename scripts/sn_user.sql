--# mysql -u root -p
--# Enter password: 12345Qwert

-- 创建用户
create user 'dev'@'localhost' identified by '12345Qwert';

-- 设置用户密码等级
ALTER USER 'dev'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345Qwert';
FLUSH PRIVILEGES;

-- 查看用户
SELECT User, Host FROM mysql.user;

-- 展示所有数据库
show databases;

-- 查看用户权限
show grants for 'dev'@'localhost';


-- 创建库存数据库
create database if not exists sn_user;
-- 分配权限
grant ALL on sn_user.* to 'dev'@'localhost';

-- 使用数据库
use sn_user;


-- 普通用户表
create table userInfo (
    accountId int(11) primary key,
    userName varchar(20),
    nickName varchar(20),
    avatars varchar(20),
    email varchar(100),
    birthday timestamp,
    gender int(1),
    extInfo json
);


-- 用户标签表
create table userTag (
    tagId int(11) primary key auto_increment,
    accountId int(6),
    tagName varchar(255),
    type int(4)
);

create table userAddress (
    id int(11) primary key auto_increment,
    accountId int(11),
    isDefaultAddress int(1),
    receiver varchar(30),
    phoneCountryCode varchar(6),
    phoneNo varchar(20),
    countryId int(5),
    provinceCode varchar(10),
    cityCode varchar(10),
    districtCode varchar(10),
    detail varchar(200),
    tag varchar(10),
    latitude decimal(10, 7),
    longitude decimal(10, 7)
);

create table userInvoice (
    id int(11) primary key auto_increment,
    accountId int(11),
    isDefault int(1),
    type int(1),
    titleType int(1),
    title varchar(200),
    taxCode varchar(100),
    phoneNo varchar(20),
    updateDt timestamp
);