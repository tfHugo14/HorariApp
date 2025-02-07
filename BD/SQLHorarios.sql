CREATE TABLE Ciclos (
    id_ciclos TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    duracion INTEGER NOT NULL
);

CREATE TABLE Profesor (
    id_profesor TEXT PRIMARY KEY,
    nombre TEXT
);

CREATE TABLE Modulos (
    id_modulo TEXT PRIMARY KEY,
    duracion INTEGER,
    nombre TEXT,
    horas_semanales INTEGER,
    descripcion TEXT,
    id_ciclos TEXT,
    id_profesor TEXT,
    FOREIGN KEY (id_ciclos) REFERENCES Ciclos (id_ciclos),
    FOREIGN KEY (id_profesor) REFERENCES Profesor (id_profesor)
);

CREATE TABLE Sesiones (
    id_sesiones TEXT PRIMARY KEY,
    hora_ini TEXT,
    hora_fin TEXT,
    dia TEXT,
    aula INTEGER,
    descripcion TEXT,
    id_modulos INTEGER,
    FOREIGN KEY (id_modulos) REFERENCES Modulos
);

CREATE TABLE Estudiante (
    id_usuario TEXT PRIMARY KEY,
    nombre TEXT,
    contrasenha TEXT,
    dni TEXT
);

CREATE TABLE Administrador (
    id_usuario TEXT PRIMARY KEY,
    nombre TEXT,
    contrasenha TEXT,
    dni TEXT
);

CREATE TABLE matricular_ciclo (
    id_ciclos TEXT,
    id_usuario TEXT,
    PRIMARY KEY (id_ciclos, id_usuario),
    FOREIGN KEY (id_ciclos) REFERENCES Ciclos (id_ciclos),
    FOREIGN KEY (id_usuario) REFERENCES Estudiante (id_usuario)
);

CREATE TABLE matricular_modulos (
    id_modulos TEXT,
    id_usuario TEXT,
    PRIMARY KEY (id_modulos, id_usuario),
    FOREIGN KEY (id_modulos) REFERENCES Modulos (id_modulo),
    FOREIGN KEY (id_usuario) REFERENCES Estudiante (id_usuario)
);

CREATE TABLE administrar (
    id_ciclos TEXT,
    id_usuario TEXT,
    PRIMARY KEY (id_ciclos, id_usuario),
    FOREIGN KEY (id_ciclos) REFERENCES Ciclos (id_ciclos),
    FOREIGN KEY (id_usuario) REFERENCES Administrador (id_usuario)
);
