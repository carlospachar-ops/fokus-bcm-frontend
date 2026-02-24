CREATE DATABASE  IF NOT EXISTS `bdfokus` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bdfokus`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: bdfokus
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `aplicacion`
--

DROP TABLE IF EXISTS `aplicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aplicacion` (
  `id_aplicacion` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `version` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rto_horas` int DEFAULT NULL,
  `impacto_negocio` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `id_proveedor` int DEFAULT NULL,
  `id_propietario` int DEFAULT NULL,
  PRIMARY KEY (`id_aplicacion`),
  KEY `fk_app_proveedor` (`id_proveedor`),
  KEY `fk_app_propietario` (`id_propietario`),
  CONSTRAINT `fk_app_propietario` FOREIGN KEY (`id_propietario`) REFERENCES `propietario` (`id_propietario`) ON DELETE SET NULL,
  CONSTRAINT `fk_app_proveedor` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aplicacion`
--

LOCK TABLES `aplicacion` WRITE;
/*!40000 ALTER TABLE `aplicacion` DISABLE KEYS */;
INSERT INTO `aplicacion` VALUES (1,'Core Banking','Sistema core de transacciones','1.0.0',4,'Alto',1,1),(2,'Portal Clientes','Portal web para clientes','2.3.1',12,'Medio',1,1);
/*!40000 ALTER TABLE `aplicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `archivo`
--

DROP TABLE IF EXISTS `archivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `archivo` (
  `id_archivo` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `tipo` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `autor` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `departamento` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `version_label` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_creacion` date DEFAULT NULL,
  `fecha_carga` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ruta_archivo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_archivo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `archivo`
--

LOCK TABLES `archivo` WRITE;
/*!40000 ALTER TABLE `archivo` DISABLE KEYS */;
INSERT INTO `archivo` VALUES (1,'Plan_Continuidad_Core','Plan de continuidad del Core','PDF','Carlos Pachar','TI','v1','2026-02-01','2026-02-23 16:31:11','/drive/plan_continuidad_core_v1.pdf'),(2,'Plan_Continuidad_Core','Actualizacion del plan','PDF','Carlos Pachar','TI','v11','2026-02-20','2026-02-23 16:31:11','/drive/plan_continuidad_core_v11.pdf');
/*!40000 ALTER TABLE `archivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comentario`
--

DROP TABLE IF EXISTS `comentario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comentario` (
  `id_comentario` int NOT NULL AUTO_INCREMENT,
  `comentario` text COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_usuario` int NOT NULL,
  `id_aplicacion` int DEFAULT NULL,
  `id_ubicacion` int DEFAULT NULL,
  PRIMARY KEY (`id_comentario`),
  KEY `fk_comentario_usuario` (`id_usuario`),
  KEY `fk_comentario_aplicacion` (`id_aplicacion`),
  KEY `fk_comentario_ubicacion` (`id_ubicacion`),
  CONSTRAINT `fk_comentario_aplicacion` FOREIGN KEY (`id_aplicacion`) REFERENCES `aplicacion` (`id_aplicacion`) ON DELETE CASCADE,
  CONSTRAINT `fk_comentario_ubicacion` FOREIGN KEY (`id_ubicacion`) REFERENCES `ubicacion` (`id_ubicacion`) ON DELETE CASCADE,
  CONSTRAINT `fk_comentario_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE RESTRICT,
  CONSTRAINT `ck_comentario_objetivo` CHECK ((((`id_aplicacion` is not null) and (`id_ubicacion` is null)) or ((`id_aplicacion` is null) and (`id_ubicacion` is not null))))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentario`
--

LOCK TABLES `comentario` WRITE;
/*!40000 ALTER TABLE `comentario` DISABLE KEYS */;
INSERT INTO `comentario` VALUES (1,'Se actualizo la documentacion del Core Banking.','2026-02-23 16:31:11',2,1,NULL),(2,'Revisar RTO del Portal Clientes por nuevos requerimientos.','2026-02-23 16:31:11',3,2,NULL),(3,'Mantenimiento programado en Data Center Principal.','2026-02-23 16:31:11',4,NULL,1);
/*!40000 ALTER TABLE `comentario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacto`
--

DROP TABLE IF EXISTS `contacto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacto` (
  `id_contacto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `celular` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fijo` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `posicion` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `departamento` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `responsable` tinyint(1) DEFAULT NULL,
  `tipo_contacto` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `comentarios` text COLLATE utf8mb4_general_ci,
  `id_aplicacion` int DEFAULT NULL,
  `id_ubicacion` int DEFAULT NULL,
  `id_proveedor` int DEFAULT NULL,
  PRIMARY KEY (`id_contacto`),
  KEY `fk_contacto_app` (`id_aplicacion`),
  KEY `fk_contacto_ubic` (`id_ubicacion`),
  KEY `fk_contacto_prov` (`id_proveedor`),
  CONSTRAINT `fk_contacto_app` FOREIGN KEY (`id_aplicacion`) REFERENCES `aplicacion` (`id_aplicacion`) ON DELETE CASCADE,
  CONSTRAINT `fk_contacto_prov` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`) ON DELETE CASCADE,
  CONSTRAINT `fk_contacto_ubic` FOREIGN KEY (`id_ubicacion`) REFERENCES `ubicacion` (`id_ubicacion`) ON DELETE CASCADE,
  CONSTRAINT `ck_contacto_objetivo` CHECK ((((`id_aplicacion` is not null) and (`id_ubicacion` is null) and (`id_proveedor` is null)) or ((`id_aplicacion` is null) and (`id_ubicacion` is not null) and (`id_proveedor` is null)) or ((`id_aplicacion` is null) and (`id_ubicacion` is null) and (`id_proveedor` is not null))))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacto`
--

LOCK TABLES `contacto` WRITE;
/*!40000 ALTER TABLE `contacto` DISABLE KEYS */;
INSERT INTO `contacto` VALUES (1,'Sofia Ramirez','0991111111','072222222','sofia.ramirez@example.com','Soporte App','TI',1,'Aplicacion','Contacto principal de la app',1,NULL,NULL),(2,'Diego Mora','0993333333','073333333','diego.mora@example.com','Facilities','Operaciones',1,'Ubicacion','Contacto de instalaciones',NULL,1,NULL),(3,'Soporte AWS',NULL,NULL,'support@aws.example','Soporte','Proveedor',1,'Proveedor','Mesa de ayuda',NULL,NULL,1);
/*!40000 ALTER TABLE `contacto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dependencia_aplicacion`
--

DROP TABLE IF EXISTS `dependencia_aplicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dependencia_aplicacion` (
  `id_aplicacion` int NOT NULL,
  `id_aplicacion_dependiente` int NOT NULL,
  PRIMARY KEY (`id_aplicacion`,`id_aplicacion_dependiente`),
  KEY `fk_dep_app_destino` (`id_aplicacion_dependiente`),
  CONSTRAINT `fk_dep_app_destino` FOREIGN KEY (`id_aplicacion_dependiente`) REFERENCES `aplicacion` (`id_aplicacion`) ON DELETE CASCADE,
  CONSTRAINT `fk_dep_app_origen` FOREIGN KEY (`id_aplicacion`) REFERENCES `aplicacion` (`id_aplicacion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dependencia_aplicacion`
--

LOCK TABLES `dependencia_aplicacion` WRITE;
/*!40000 ALTER TABLE `dependencia_aplicacion` DISABLE KEYS */;
INSERT INTO `dependencia_aplicacion` VALUES (2,1);
/*!40000 ALTER TABLE `dependencia_aplicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dependencia_hardware`
--

DROP TABLE IF EXISTS `dependencia_hardware`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dependencia_hardware` (
  `id_hardware` int NOT NULL,
  `id_hardware_dependiente` int NOT NULL,
  PRIMARY KEY (`id_hardware`,`id_hardware_dependiente`),
  KEY `fk_dep_hw_destino` (`id_hardware_dependiente`),
  CONSTRAINT `fk_dep_hw_destino` FOREIGN KEY (`id_hardware_dependiente`) REFERENCES `hardware` (`id_hardware`) ON DELETE CASCADE,
  CONSTRAINT `fk_dep_hw_origen` FOREIGN KEY (`id_hardware`) REFERENCES `hardware` (`id_hardware`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dependencia_hardware`
--

LOCK TABLES `dependencia_hardware` WRITE;
/*!40000 ALTER TABLE `dependencia_hardware` DISABLE KEYS */;
INSERT INTO `dependencia_hardware` VALUES (2,1);
/*!40000 ALTER TABLE `dependencia_hardware` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dependencia_ubicacion`
--

DROP TABLE IF EXISTS `dependencia_ubicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dependencia_ubicacion` (
  `id_ubicacion` int NOT NULL,
  `id_ubicacion_dependiente` int NOT NULL,
  PRIMARY KEY (`id_ubicacion`,`id_ubicacion_dependiente`),
  KEY `fk_dep_ubic_destino` (`id_ubicacion_dependiente`),
  CONSTRAINT `fk_dep_ubic_destino` FOREIGN KEY (`id_ubicacion_dependiente`) REFERENCES `ubicacion` (`id_ubicacion`) ON DELETE CASCADE,
  CONSTRAINT `fk_dep_ubic_origen` FOREIGN KEY (`id_ubicacion`) REFERENCES `ubicacion` (`id_ubicacion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dependencia_ubicacion`
--

LOCK TABLES `dependencia_ubicacion` WRITE;
/*!40000 ALTER TABLE `dependencia_ubicacion` DISABLE KEYS */;
INSERT INTO `dependencia_ubicacion` VALUES (2,1);
/*!40000 ALTER TABLE `dependencia_ubicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documentos_aplicacion`
--

DROP TABLE IF EXISTS `documentos_aplicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documentos_aplicacion` (
  `id_documento_app` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `tipo` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `autor` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_expiracion` date DEFAULT NULL,
  `ruta_archivo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `id_aplicacion` int NOT NULL,
  PRIMARY KEY (`id_documento_app`),
  KEY `fk_doc_app` (`id_aplicacion`),
  CONSTRAINT `fk_doc_app` FOREIGN KEY (`id_aplicacion`) REFERENCES `aplicacion` (`id_aplicacion`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documentos_aplicacion`
--

LOCK TABLES `documentos_aplicacion` WRITE;
/*!40000 ALTER TABLE `documentos_aplicacion` DISABLE KEYS */;
INSERT INTO `documentos_aplicacion` VALUES (1,'Manual Core Banking','Guia de operacion','PDF','TI','2027-01-01','/docs/core/manual_v1.pdf',1);
/*!40000 ALTER TABLE `documentos_aplicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documentos_ubicacion`
--

DROP TABLE IF EXISTS `documentos_ubicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documentos_ubicacion` (
  `id_documento_ubic` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `tipo` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `autor` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_expiracion` date DEFAULT NULL,
  `ruta_archivo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `id_ubicacion` int NOT NULL,
  PRIMARY KEY (`id_documento_ubic`),
  KEY `fk_doc_ubic` (`id_ubicacion`),
  CONSTRAINT `fk_doc_ubic` FOREIGN KEY (`id_ubicacion`) REFERENCES `ubicacion` (`id_ubicacion`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documentos_ubicacion`
--

LOCK TABLES `documentos_ubicacion` WRITE;
/*!40000 ALTER TABLE `documentos_ubicacion` DISABLE KEYS */;
INSERT INTO `documentos_ubicacion` VALUES (1,'Plano Data Center','Plano actualizado','PDF','Infra','2028-01-01','/docs/ubicacion/dc_plano.pdf',1);
/*!40000 ALTER TABLE `documentos_ubicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleado`
--

DROP TABLE IF EXISTS `empleado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleado` (
  `id_empleado` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `departamento` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rol` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `habilidad_critica` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `numero_requerido` int DEFAULT NULL,
  `id_rol_empleado` int DEFAULT NULL,
  PRIMARY KEY (`id_empleado`),
  KEY `fk_empleado_rol` (`id_rol_empleado`),
  CONSTRAINT `fk_empleado_rol` FOREIGN KEY (`id_rol_empleado`) REFERENCES `rol_empleado` (`id_rol_empleado`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleado`
--

LOCK TABLES `empleado` WRITE;
/*!40000 ALTER TABLE `empleado` DISABLE KEYS */;
INSERT INTO `empleado` VALUES (1,'Carlos Pachar','TI','Analista','Continuidad/BCP',1,1),(2,'Maria Lopez','Operaciones','Gerente','Decision critica',1,2),(3,'Juan Perez','TI','Tecnico','Infraestructura',2,3);
/*!40000 ALTER TABLE `empleado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleado_asignado`
--

DROP TABLE IF EXISTS `empleado_asignado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleado_asignado` (
  `id_aplicacion` int NOT NULL,
  `id_empleado` int NOT NULL,
  PRIMARY KEY (`id_aplicacion`,`id_empleado`),
  KEY `fk_emp_asig_emp` (`id_empleado`),
  CONSTRAINT `fk_emp_asig_app` FOREIGN KEY (`id_aplicacion`) REFERENCES `aplicacion` (`id_aplicacion`) ON DELETE CASCADE,
  CONSTRAINT `fk_emp_asig_emp` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleado_asignado`
--

LOCK TABLES `empleado_asignado` WRITE;
/*!40000 ALTER TABLE `empleado_asignado` DISABLE KEYS */;
INSERT INTO `empleado_asignado` VALUES (1,1),(1,3);
/*!40000 ALTER TABLE `empleado_asignado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleado_respaldo`
--

DROP TABLE IF EXISTS `empleado_respaldo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleado_respaldo` (
  `id_aplicacion` int NOT NULL,
  `id_empleado` int NOT NULL,
  PRIMARY KEY (`id_aplicacion`,`id_empleado`),
  KEY `fk_emp_resp_emp` (`id_empleado`),
  CONSTRAINT `fk_emp_resp_app` FOREIGN KEY (`id_aplicacion`) REFERENCES `aplicacion` (`id_aplicacion`) ON DELETE CASCADE,
  CONSTRAINT `fk_emp_resp_emp` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleado_respaldo`
--

LOCK TABLES `empleado_respaldo` WRITE;
/*!40000 ALTER TABLE `empleado_respaldo` DISABLE KEYS */;
INSERT INTO `empleado_respaldo` VALUES (2,2);
/*!40000 ALTER TABLE `empleado_respaldo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hardware`
--

DROP TABLE IF EXISTS `hardware`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hardware` (
  `id_hardware` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `serial` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rto_horas` int DEFAULT NULL,
  `impacto_negocio` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `id_proveedor` int DEFAULT NULL,
  `id_propietario` int DEFAULT NULL,
  `id_ubicacion` int DEFAULT NULL,
  PRIMARY KEY (`id_hardware`),
  KEY `fk_hw_proveedor` (`id_proveedor`),
  KEY `fk_hw_propietario` (`id_propietario`),
  KEY `fk_hw_ubicacion` (`id_ubicacion`),
  CONSTRAINT `fk_hw_propietario` FOREIGN KEY (`id_propietario`) REFERENCES `propietario` (`id_propietario`) ON DELETE SET NULL,
  CONSTRAINT `fk_hw_proveedor` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`) ON DELETE SET NULL,
  CONSTRAINT `fk_hw_ubicacion` FOREIGN KEY (`id_ubicacion`) REFERENCES `ubicacion` (`id_ubicacion`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hardware`
--

LOCK TABLES `hardware` WRITE;
/*!40000 ALTER TABLE `hardware` DISABLE KEYS */;
INSERT INTO `hardware` VALUES (1,'Servidor DB01','Servidor de base de datos principal','SN-DB01-001',4,'Alto',2,2,1),(2,'Switch Core','Switch principal de red','SN-SW-CORE-777',8,'Alto',2,2,1);
/*!40000 ALTER TABLE `hardware` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proceso`
--

DROP TABLE IF EXISTS `proceso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proceso` (
  `id_proceso` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `rto_horas` int DEFAULT NULL,
  `rpo_horas` int DEFAULT NULL,
  `mtpd_horas` int DEFAULT NULL,
  `estado` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `criticidad` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_proxima_revision` date DEFAULT NULL,
  PRIMARY KEY (`id_proceso`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proceso`
--

LOCK TABLES `proceso` WRITE;
/*!40000 ALTER TABLE `proceso` DISABLE KEYS */;
INSERT INTO `proceso` VALUES (1,'Procesamiento de Pagos','Procesa pagos y transferencias',4,1,24,'Activo','Alta','2026-12-01'),(2,'Atencion al Cliente','Gestion de solicitudes de clientes',12,4,72,'Activo','Media','2026-10-15');
/*!40000 ALTER TABLE `proceso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proceso_aplicacion`
--

DROP TABLE IF EXISTS `proceso_aplicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proceso_aplicacion` (
  `id_proceso` int NOT NULL,
  `id_aplicacion` int NOT NULL,
  PRIMARY KEY (`id_proceso`,`id_aplicacion`),
  KEY `fk_proc_app_aplicacion` (`id_aplicacion`),
  CONSTRAINT `fk_proc_app_aplicacion` FOREIGN KEY (`id_aplicacion`) REFERENCES `aplicacion` (`id_aplicacion`) ON DELETE CASCADE,
  CONSTRAINT `fk_proc_app_proceso` FOREIGN KEY (`id_proceso`) REFERENCES `proceso` (`id_proceso`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proceso_aplicacion`
--

LOCK TABLES `proceso_aplicacion` WRITE;
/*!40000 ALTER TABLE `proceso_aplicacion` DISABLE KEYS */;
INSERT INTO `proceso_aplicacion` VALUES (1,1),(2,2);
/*!40000 ALTER TABLE `proceso_aplicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proceso_ubicacion`
--

DROP TABLE IF EXISTS `proceso_ubicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proceso_ubicacion` (
  `id_proceso` int NOT NULL,
  `id_ubicacion` int NOT NULL,
  PRIMARY KEY (`id_proceso`,`id_ubicacion`),
  KEY `fk_proc_ubic_ubicacion` (`id_ubicacion`),
  CONSTRAINT `fk_proc_ubic_proceso` FOREIGN KEY (`id_proceso`) REFERENCES `proceso` (`id_proceso`) ON DELETE CASCADE,
  CONSTRAINT `fk_proc_ubic_ubicacion` FOREIGN KEY (`id_ubicacion`) REFERENCES `ubicacion` (`id_ubicacion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proceso_ubicacion`
--

LOCK TABLES `proceso_ubicacion` WRITE;
/*!40000 ALTER TABLE `proceso_ubicacion` DISABLE KEYS */;
INSERT INTO `proceso_ubicacion` VALUES (1,1),(2,2);
/*!40000 ALTER TABLE `proceso_ubicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `propietario`
--

DROP TABLE IF EXISTS `propietario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `propietario` (
  `id_propietario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `cargo` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `departamento` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefono` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `impacto_negocio` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_propietario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `propietario`
--

LOCK TABLES `propietario` WRITE;
/*!40000 ALTER TABLE `propietario` DISABLE KEYS */;
INSERT INTO `propietario` VALUES (1,'Ana Torres','Owner de aplicaciones core','Product Owner','TI','ana.torres@example.com','0999999999','Alto'),(2,'Luis Vega','Owner de infraestructura','IT Manager','TI','luis.vega@example.com','0988888888','Medio');
/*!40000 ALTER TABLE `propietario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedor`
--

DROP TABLE IF EXISTS `proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedor` (
  `id_proveedor` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `producto_servicio` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_expiracion_contrato` date DEFAULT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `impacto_negocio` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedor`
--

LOCK TABLES `proveedor` WRITE;
/*!40000 ALTER TABLE `proveedor` DISABLE KEYS */;
INSERT INTO `proveedor` VALUES (1,'AWS','Servicios cloud','Cloud Hosting','2027-12-31','Cloud','soporte@aws.example','Alto'),(2,'Cisco','Networking','Switches/Routers','2026-10-15','Quito','ventas@cisco.example','Medio');
/*!40000 ALTER TABLE `proveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol_empleado`
--

DROP TABLE IF EXISTS `rol_empleado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol_empleado` (
  `id_rol_empleado` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_rol_empleado`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol_empleado`
--

LOCK TABLES `rol_empleado` WRITE;
/*!40000 ALTER TABLE `rol_empleado` DISABLE KEYS */;
INSERT INTO `rol_empleado` VALUES (1,'Analista','Analista de continuidad'),(2,'Gerente','Gerencia de area'),(3,'Tecnico','Soporte tecnico');
/*!40000 ALTER TABLE `rol_empleado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol_sistema`
--

DROP TABLE IF EXISTS `rol_sistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol_sistema` (
  `id_rol_sistema` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_rol_sistema`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol_sistema`
--

LOCK TABLES `rol_sistema` WRITE;
/*!40000 ALTER TABLE `rol_sistema` DISABLE KEYS */;
INSERT INTO `rol_sistema` VALUES (1,'superadmin','Control total del sistema'),(2,'administrador','Administra catalogos y configuracion'),(3,'empleado','Acceso operativo basico');
/*!40000 ALTER TABLE `rol_sistema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ubicacion`
--

DROP TABLE IF EXISTS `ubicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ubicacion` (
  `id_ubicacion` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `ciudad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pais` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tipo_ubicacion` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `impacto_negocio` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_ubicacion`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ubicacion`
--

LOCK TABLES `ubicacion` WRITE;
/*!40000 ALTER TABLE `ubicacion` DISABLE KEYS */;
INSERT INTO `ubicacion` VALUES (1,'Data Center Principal','Centro de datos principal','Cuenca','Ecuador','Av. Principal 123','DataCenter','Alto'),(2,'Oficina Matriz','Oficina administrativa','Quito','Ecuador','Av. Central 456','Oficina','Medio');
/*!40000 ALTER TABLE `ubicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `username` varchar(60) COLLATE utf8mb4_general_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_empleado` int DEFAULT NULL,
  `id_rol_sistema` int NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `id_empleado` (`id_empleado`),
  KEY `fk_usuario_rol` (`id_rol_sistema`),
  CONSTRAINT `fk_usuario_empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`) ON DELETE SET NULL,
  CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol_sistema`) REFERENCES `rol_sistema` (`id_rol_sistema`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'superadmin','$2b$10$examplehashsuperadmin',1,'2026-02-23 16:31:11',NULL,1),(2,'cpachar','$2b$10$examplehash1',1,'2026-02-23 16:31:11',1,2),(3,'mlopez','$2b$10$examplehash2',1,'2026-02-23 16:31:11',2,2),(4,'jperez','$2b$10$examplehash3',1,'2026-02-23 16:31:11',3,3);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-23 16:37:13
