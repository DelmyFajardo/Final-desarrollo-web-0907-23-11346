import { useState, useEffect } from 'react';

export default function App() {
  const [autenticado, setAutenticado] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [salas, setSalas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [mensajeError, setMensajeError] = useState('');

  // Formulario Reserva
  const [salaId, setSalaId] = useState('');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');

  const API = 'http://localhost:3000/api';

  // Wrapper para manejar peticiones y capturar status 401 (Redirección automática)
  const fetchConAuth = async (url, options = {}) => {
    const res = await fetch(url, { ...options, credentials: 'include' });
    if (res.status === 401) {
      setAutenticado(false);
      setMensajeError('Sesión expirada por inactividad. Inicie sesión de nuevo.');
      throw new Error('401 Unauthorized');
    }
    return res;
  };

  const verificarSesion = async () => {
    try {
      const res = await fetchConAuth(`${API}/auth/check`);
      if (res.ok) setAutenticado(true);
    } catch (err) {
      setAutenticado(false);
    }
  };

  useEffect(() => {
    verificarSesion();
  }, []);

  const cargarDatos = async () => {
    try {
      const resSalas = await fetchConAuth(`${API}/salas`);
      const dataSalas = await resSalas.json();
      setSalas(dataSalas);
      if (dataSalas.length > 0) setSalaId(dataSalas[0].id);

      const resReservas = await fetchConAuth(`${API}/reservas`);
      const dataReservas = await resReservas.json();
      setReservas(dataReservas);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (autenticado) cargarDatos();
  }, [autenticado]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensajeError('');
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setAutenticado(true);
      } else {
        const data = await res.json();
        setMensajeError(data.mensaje || data.error || 'Credenciales inválidas');
      }
    } catch (err) {
      setMensajeError('No se pudo conectar con el servidor.');
    }
  };

  const handleLogout = async () => {
    await fetch(`${API}/logout`, { method: 'POST', credentials: 'include' });
    setAutenticado(false);
  };

  const handleReserva = async (e) => {
    e.preventDefault();
    setMensajeError('');
    try {
      const res = await fetchConAuth(`${API}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salaId, fecha, horaInicio, horaFin }),
      });

      if (res.ok) {
        alert('¡Reserva creada exitosamente!');
        setFecha('');
        setHoraInicio('');
        setHoraFin('');
        cargarDatos();
      } else {
        const data = await res.json();
        setMensajeError(data.mensaje || data.error || 'Error al crear la reserva');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!autenticado) {
    return (
      <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto', fontFamily: 'sans-serif' }}>
        <h2>Iniciar Sesión</h2>
        {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '1rem', padding: '8px' }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '1rem', padding: '8px' }}
          />
          <button type="submit" style={{ width: '100%', padding: '10px' }}>Ingresar</button>
        </form>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '1rem' }}>
          Usuario demo: admin@biblioteca.com / 123456
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Sistema de Reserva de Salas</h1>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>

      {mensajeError && <p style={{ color: 'red', fontWeight: 'bold' }}>{mensajeError}</p>}

      <section style={{ marginBottom: '2rem', background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
        <h2>Nueva Reserva</h2>
        <form onSubmit={handleReserva}>
          <label>Sala: </label>
          <select value={salaId} onChange={(e) => setSalaId(e.target.value)} style={{ marginRight: '1rem' }}>
            {salas.map((s) => (
              <option key={s.id} value={s.id}>{s.nombre} (Cap: {s.capacidad})</option>
            ))}
          </select>

          <label>Fecha: </label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required style={{ marginRight: '1rem' }} />

          <br /><br />

          <label>Hora Inicio: </label>
          <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} required style={{ marginRight: '1rem' }} />

          <label>Hora Fin: </label>
          <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} required style={{ marginRight: '1rem' }} />

          <button type="submit">Reservar</button>
        </form>
      </section>

      <section>
        <h2>Reservas Existentes</h2>
        <ul>
          {reservas.map((r) => (
            <li key={r.id} style={{ marginBottom: '8px' }}>
              <strong>{r.Sala?.nombre || 'Sala'}</strong> — Fecha: {r.fecha} | Horario: {r.horaInicio} a {r.horaFin}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}