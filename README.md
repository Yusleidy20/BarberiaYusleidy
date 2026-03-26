# Barbería Yusleidy · Agenda Pro

Versión web moderna para barbería con enfoque en **agendamiento de citas** y **disponibilidad por barbero**.

## Funcionalidades implementadas
- Diseño visual moderno (glassmorphism + gradientes + UI responsive).
- Dashboard con métricas rápidas:
  - barberos activos,
  - citas del día,
  - barberos disponibles.
- Sección de equipo con estado por barbero:
  - Disponible,
  - Ocupado,
  - No disponible.
- Asignación de clientes por barbero al agendar citas.
- Validaciones de agenda:
  - evita doble reserva del mismo barbero en la misma fecha/hora,
  - evita agendar con barbero no disponible.
- Vista de agenda diaria ordenada por hora.

## Archivos
- `index.html` → estructura de la interfaz.
- `styles.css` → diseño y comportamiento responsive.
- `script.js` → lógica de disponibilidad, asignación y agendamiento.

## Cómo ejecutar
```bash
python3 -m http.server 8000
```

Abrir en navegador:

```text
http://localhost:8000
```

## Próximo paso recomendado
Conectar esta interfaz a un backend (API + base de datos) para persistencia real de barberos, clientes y citas.
