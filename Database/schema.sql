create database if not exists dishshare;
use dishshare;

create table if not exists users (
    userId    int          primary key auto_increment,
    firstName varchar(50)  not null,
    lastName  varchar(50)  not null,
    email     varchar(255) not null unique,
    password  varchar(255) not null,
    role      varchar(20)  not null
);

create table if not exists recipes (
    recipeId           int              primary key auto_increment,
    userId             int              not null,
    title              varchar(255)     not null,
    linkUrl            varchar(1000)    not null,
    platform           enum('tiktok','instagram','facebook') not null,
    ingredients        json             not null,
    instructions       text             null,
    servings           varchar(50)      null,
    thumbnail          varchar(1000)    null,
    totalCalories      decimal(10,2)    null,
    caloriesPerServing decimal(10,2)    null,
    protein            decimal(10,2)    null,
    carbs              decimal(10,2)    null,
    fats               decimal(10,2)    null,
    proteinPerServing  decimal(10,2)    null,
    carbsPerServing    decimal(10,2)    null,
    fatsPerServing     decimal(10,2)    null,
    savedAt            timestamp        not null default current_timestamp,
    foreign key (userId) references users(userId) on delete cascade
);
