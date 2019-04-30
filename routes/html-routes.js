const path = require("path");
const mysql = require("mysql");
const cookieParser = require("cookie-parser");
const express = require("express");

module.exports = function(app, connection) {
    let router = express.Router();

    router.get("/", function(req, res) {
        res.sendFile(path.join(__dirname, "..", "public", "index.html"));
    });

    router.post("/login", function(req, res) {
        var nombre = req.query.nombre;
        var nombres = req.query.nombres;
        connection.query(
            "call sp_login('" + nombre + "','" + nombres + "');",
            function(err, data) {
                let x = JSON.stringify(data[0]);
                let a = JSON.parse(x);
                let token = a[0].token;
                res.cookie("SessionID", token, {
                    httpOnly: true,
                    secure: false,
                    domain: null,
                    expires: new Date(Date.now() + 900000)
                });
                delete data[0][0].token;
                err ? res.send(err) : res.json({ usuario: data });
            }
        );
    });

    router.post("/loginAuthenticated", function(req, res) {
        var token = req.cookies.SessionID;
        connection.query("call sp_authenticated('" + token + "');", function(
            err,
            data
        ) {
            err ? res.send(err) : res.json({ usuario: data });
        });
    });

    router.get("/demanda", function(req, res) {
        var tipo = req.query.tipo;
        connection.query("call sp_Demanda('" + tipo + "');", function(
            err,
            data
        ) {
            err ? res.send(err) : res.json({ demanda: data });
        });
    });

    router.get("/disponibleTracto", function(req, res) {
        connection.query("call sp_disponibleTracto();", function(err, data) {
            err ? res.send(err) : res.json({ disponible: data });
        });
    });

    router.get("/disponible", function(req, res) {
        var tipo = req.query.tipo;
        connection.query("call sp_disponible('" + tipo + "');", function(
            err,
            data
        ) {
            err ? res.send(err) : res.json({ disponible: data });
        });
    });

    router.get("/mapaTracto", function(req, res) {
        connection.query("call sp_UbicacionTracto();", function(err, data) {
            err ? res.send(err) : res.json({ tracto: data });
        });
    });

    router.get("/mapaCaja", function(req, res) {
        connection.query("call sp_UbicacionCaja();", function(err, data) {
            err ? res.send(err) : res.json({ caja: data });
        });
    });

    router.get("/mapaUnidad", function(req, res) {
        var tipo = req.query.tipo;
        connection.query("call sp_ubicacionUnidad('" + tipo + "');", function(
            err,
            data
        ) {
            err ? res.send(err) : res.json({ camioneta: data });
        });
    });

    router.get("/mapaOperador", function(req, res) {
        var tipo = req.query.tipo;
        connection.query("call sp_ubicacionOperador('" + tipo + "');", function(
            err,
            data
        ) {
            err ? res.send(err) : res.json({ operador: data });
        });
    });

    router.get("/unidadesMTTO", function(req, res) {
        var tipo = req.query.tipo;
        connection.query("call sp_unidadMMTO('" + tipo + "');", function(
            err,
            data
        ) {
            err ? res.send(err) : res.json({ mtto: data });
        });
    });

    router.get("/operadorND", function(req, res) {
        var tipo = req.query.tipo;
        connection.query("call sp_NDOperador('" + tipo + "');", function(
            err,
            data
        ) {
            err ? res.send(err) : res.json({ opend: data });
        });
    });

    router.get("/programa", function(req, res) {
        var tipo = req.query.tipo;
        connection.query("call sp_programa('" + tipo + "');", function(
            err,
            data
        ) {
            err ? res.send(err) : res.json({ programa: data });
        });
    });

    router.get("/asignados", function(req, res) {
        var tipo = req.query.tipo;
        connection.query("call sp_asignados('" + tipo + "');", function(
            err,
            data
        ) {
            err ? res.send(err) : res.json({ programa: data });
        });
    });

    router.get("/oDisponibles", function(req, res) {
        var tipo = req.query.tipo;
        connection.query("call sp_oDisponibles('" + tipo + "');", function(
            err,
            data
        ) {
            err ? res.send(err) : res.json({ operadores: data });
        });
    });

    router.post("/programar", function(req, res) {
            var servicio = req.query.servicio;
            var unidad = req.query.unidad;
            var operador = req.query.operador;
            var caja = req.query.caja;
            var tipo = req.query.tipo;
            console.log(
                "Servicio " +
                    servicio +
                    " unidad " +
                    unidad +
                    " caja " +
                    caja +
                    " operador " +
                    operador +
                    " TIPO " +
                    tipo
            );
            connection.query(
                "call sp_progServicio('" +
                    servicio +
                    "','" +
                    unidad +
                    "','" +
                    operador +
                    "','" +
                    tipo +
                    "','" +
                    caja +
                    "');",
                function(err, data) {
                    err ? res.send(err) : res.json({ status: data });
                }
            );
    });

    router.post("/distanciaTracto", function(req, res) {
        var servicio = req.query.servicio;
        connection.query(
            "call sp_distanciaTracto('" + servicio + "');",
            function(err, data) {
                err ? res.send(err) : res.json({ distancia: data });
            }
        );
    });

    router.post("/distanciaOperador", function(req, res) {
        var servicio = req.query.servicio;
        connection.query(
            "call sp_distanciaOperador('" + servicio + "');",
            function(err, data) {
                err ? res.send(err) : res.json({ distancia: data });
            }
        );
    });

    router.post("/distanciaCaja", function(req, res) {
        var servicio = req.query.servicio;
        connection.query("call sp_distanciaCaja('" + servicio + "');", function(
            err,
            data
        ) {
            err ? res.send(err) : res.json({ distancia: data });
        });
    });

    router.post("/distanciaCamioneta", function(req, res) {
        var servicio = req.query.servicio;
        connection.query(
            "call sp_distanciaCamioneta('" + servicio + "');",
            function(err, data) {
                err ? res.send(err) : res.json({ distancia: data });
            }
        );
    });

    router.post("/distanciaOpeCam", function(req, res) {
        var servicio = req.query.servicio;
        connection.query(
            "call sp_distanciaOpeCam('" + servicio + "');",
            function(err, data) {
                err ? res.send(err) : res.json({ distancia: data });
            }
        );
    });

    router.post("/distanciaOpeTor", function(req, res) {
        var servicio = req.query.servicio;
        connection.query(
            "call sp_distanciaOpeTorton('" + servicio + "');",
            function(err, data) {
                err ? res.send(err) : res.json({ distancia: data });
            }
        );
    });

    router.post("/distanciaTorton", function(req, res) {
        var servicio = req.query.servicio;
        connection.query(
            "call sp_distanciaTorton('" + servicio + "');",
            function(err, data) {
                err ? res.send(err) : res.json({ distancia: data });
            }
        );
    });

    app.use("/tescobedo/api", router);
};
