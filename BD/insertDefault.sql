INSERT INTO Ciclos (id_ciclos, nombre, descripcion, duracion) VALUES
('C001', 'Desarrollo Web', 'Desarrollo de aplicaciones web', 2000),
('C002', 'Administración de Sistemas', 'Gestión de sistemas informáticos', 1800),
('C003', 'Marketing Digital', 'Estrategias de marketing online', 1500);

INSERT INTO Profesor (id_profesor, nombre) VALUES
('P001', 'Juan Pérez'),
('P002', 'Ana García'),
('P003', 'Luis López');

INSERT INTO Modulos (id_modulo, duracion, nombre, horas_semanales, descripcion, id_ciclos, id_profesor) VALUES
('M001', 300, 'HTML y CSS', 10, 'Introducción al diseño web', 'C001', 'P001'),
('M002', 400, 'Redes y Sistemas', 12, 'Gestión de redes', 'C002', 'P002'),
('M003', 250, 'SEO y SEM', 8, 'Optimización en buscadores', 'C003', 'P003');

INSERT INTO Sesiones (id_sesiones, hora_ini, hora_fin, dia, aula, descripcion, id_modulos) VALUES
('S001', '2025-01-20 08:00:00', '2025-01-20 10:00:00', '2025-01-20', 101, 'Clase introductoria', 'M001'),
('S002', '2025-01-21 10:00:00', '2025-01-21 12:00:00', '2025-01-21', 102, 'Prácticas de redes', 'M002'),
('S003', '2025-01-22 12:00:00', '2025-01-22 14:00:00', '2025-01-22', 103, 'Taller de SEO', 'M003');

INSERT INTO Estudiante (id_usuario, nombre, contrasenha, esAdmin, dni) VALUES
('E001', 'Carlos Torres', 'pass123', 0, '12345678A'),
('E002', 'Marta Díaz', 'secure456', 0, '87654321B'),
('E003', 'Sofía Gómez', 'mypwd789', 0, '56789012C');

INSERT INTO Administrador (id_usuario, nombre, contrasenha, esAdmin, dni) VALUES
('A001', 'Ricardo Martínez', 'admin123', 1, '23456789D'),
('A002', 'Laura Fernández', 'admin456', 1, '98765432E'),
('A003', 'Pedro Sánchez', 'admin789', 1, '34567890F');

INSERT INTO matricular_ciclo (id_ciclos, id_usuario) VALUES
('C001', 'E001'),
('C002', 'E002'),
('C003', 'E003');

INSERT INTO matricular_modulos (id_modulos, id_usuario) VALUES
('M001', 'E001'),
('M002', 'E002'),
('M003', 'E003');

INSERT INTO administrar (id_ciclos, id_usuario) VALUES
('C001', 'A001'),
('C002', 'A002'),
('C003', 'A003');