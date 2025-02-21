CREATE TABLE Ciclos (
    id_ciclos INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    duracion INTEGER NOT NULL
);

CREATE TABLE Profesor (
    id_profesor INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT
);

CREATE TABLE Modulos (
    id_modulo INTEGER PRIMARY KEY AUTOINCREMENT,
    curso INTEGER,
    nombre TEXT,
    siglas TEXT,
    horas_semanales INTEGER,
    descripcion TEXT,
    id_ciclos INTEGER,
    id_profesor INTEGER,
    FOREIGN KEY (id_ciclos) REFERENCES Ciclos (id_ciclos),
    FOREIGN KEY (id_profesor) REFERENCES Profesor (id_profesor)
);

CREATE TABLE Sesiones (
    id_sesiones INTEGER PRIMARY KEY AUTOINCREMENT,
    hora_ini TEXT,
    hora_fin TEXT,
    dia TEXT,
    aula INTEGER,
    descripcion TEXT,
    id_modulos INTEGER,
    FOREIGN KEY (id_modulos) REFERENCES Modulos (id_modulo)
);

CREATE TABLE Estudiante (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    nombreCompleto TEXT,
    contrasenha TEXT,
    dni TEXT
);

CREATE TABLE Administrador (
    id_admin INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    contrasenha TEXT,
    dni TEXT
);

CREATE TABLE matricular_ciclo (
    id_ciclos INTEGER,
    id_usuario INTEGER,
    PRIMARY KEY (id_ciclos, id_usuario),
    FOREIGN KEY (id_ciclos) REFERENCES Ciclos (id_ciclos),
    FOREIGN KEY (id_usuario) REFERENCES Estudiante (id_usuario)
);

CREATE TABLE matricular_modulos (
    id_modulos INTEGER,
    id_usuario INTEGER,
    PRIMARY KEY (id_modulos, id_usuario),
    FOREIGN KEY (id_modulos) REFERENCES Modulos (id_modulo),
    FOREIGN KEY (id_usuario) REFERENCES Estudiante (id_usuario)
);