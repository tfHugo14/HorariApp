create database GestionHoraria

create table Ciclos(
id_ciclos varchar(5) primary key,
nombre varchar(50) not null,
descripcion varchar(100) not null,
duracion int not null
);

create table Profesor(
id_profesor varchar(5) primary key,
nombre varchar(50)
);

create table Modulos(
id_modulo varchar(5) primary key,
duracion int,
nombre varchar(30),
horas_semanales smallint,
descripcion varchar(100),
id_ciclos varchar(5),
id_profesor varchar(5),
foreign key (id_ciclos) references Ciclos,
foreign key (id_profesor) references Profesor
);

create table Sesiones(
id_sesiones varchar(5) primary key,
hora_ini date,
hora_fin date,
dia date,
aula smallint,
descripcion varchar(50),
id_modulos int
)

create table Estudiante(
id_usuario varchar(5) primary key,
nombre varchar(30),
contrasenha varchar(30),
esAdmin bit,
dni varchar(9)
)

create table Administrador(
id_usuario varchar(5) primary key,
nombre varchar(30),
contrasenha varchar(30),
esAdmin bit,
dni varchar(9)
)

create table matricular_ciclo(
id_ciclos varchar(5),
id_usuario varchar(5),
primary key(id_ciclos,id_usuario),
foreign key (id_ciclos) references Ciclos,
foreign key(id_usuario) references Estudiante
)

create table matricular_modulos(
id_modulos varchar(5),
id_usuario varchar(5),
primary key(id_modulos,id_usuario),
foreign key (id_modulos) references Modulos,
foreign key(id_usuario) references Estudiante
)

create table administrar(
id_ciclos varchar(5),
id_usuario varchar(5),
primary key(id_ciclos,id_usuario),
foreign key (id_ciclos) references Ciclos,
foreign key(id_usuario) references Administrador
)
