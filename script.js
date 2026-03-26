const barbers = [
  { id: 'b1', name: 'Yusleidy', specialty: 'Fade / Estilo moderno', status: 'available' },
  { id: 'b2', name: 'Carlos', specialty: 'Corte clásico / Tijera', status: 'available' },
  { id: 'b3', name: 'Miguel', specialty: 'Barba / Perfilado', status: 'offline' }
];

const appointments = [
  {
    id: crypto.randomUUID(),
    client: 'Luis Torres',
    barberId: 'b1',
    service: 'Fade premium',
    date: todayISO(),
    time: '10:00'
  },
  {
    id: crypto.randomUUID(),
    client: 'Andrés Rojas',
    barberId: 'b2',
    service: 'Corte clásico',
    date: todayISO(),
    time: '11:00'
  }
];

const barberGrid = document.getElementById('barberGrid');
const barberSelect = document.getElementById('barberSelect');
const agendaList = document.getElementById('agendaList');
const bookingForm = document.getElementById('bookingForm');
const feedback = document.getElementById('formFeedback');
const statBarbers = document.getElementById('statBarbers');
const statAppointments = document.getElementById('statAppointments');
const statAvailable = document.getElementById('statAvailable');
const dateInput = document.getElementById('dateInput');

dateInput.value = todayISO();
dateInput.min = todayISO();

initialize();

function initialize() {
  populateBarberSelect();
  refreshDashboard();

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(bookingForm);

    const newAppointment = {
      id: crypto.randomUUID(),
      client: String(form.get('client') || '').trim(),
      barberId: String(form.get('barber')),
      service: String(form.get('service')),
      date: String(form.get('date')),
      time: String(form.get('time'))
    };

    const error = validateAppointment(newAppointment);
    if (error) {
      setFeedback(error, true);
      return;
    }

    appointments.push(newAppointment);
    setFeedback(`Cita agendada para ${newAppointment.client} a las ${newAppointment.time}.`);
    bookingForm.reset();
    dateInput.value = todayISO();
    refreshDashboard();
  });
}

function validateAppointment(appointment) {
  if (!appointment.client) return 'El nombre del cliente es obligatorio.';

  const barber = barbers.find((item) => item.id === appointment.barberId);
  if (!barber) return 'Selecciona un barbero válido.';
  if (barber.status === 'offline') {
    return `${barber.name} no está disponible en este momento.`;
  }

  const conflict = appointments.some(
    (item) =>
      item.barberId === appointment.barberId &&
      item.date === appointment.date &&
      item.time === appointment.time
  );

  if (conflict) {
    return `Ese horario ya está ocupado para ${barber.name}.`;
  }

  return '';
}

function refreshDashboard() {
  recomputeStatuses();
  renderBarbers();
  renderAgenda();
  renderStats();
}

function recomputeStatuses() {
  const today = todayISO();

  barbers.forEach((barber) => {
    if (barber.status === 'offline') return;

    const hasCurrentBooking = appointments.some(
      (item) => item.barberId === barber.id && item.date === today
    );

    barber.status = hasCurrentBooking ? 'busy' : 'available';
  });
}

function renderBarbers() {
  barberGrid.innerHTML = '';

  barbers.forEach((barber) => {
    const clients = appointments
      .filter((item) => item.barberId === barber.id && item.date === todayISO())
      .map((item) => `${item.time} · ${item.client}`);

    const liContent =
      clients.length > 0
        ? clients.map((client) => `<li>${client}</li>`).join('')
        : '<li>Sin clientes asignados hoy.</li>';

    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="section-head">
        <h3>${barber.name}</h3>
        <span class="badge ${badgeClass(barber.status)}">${statusLabel(barber.status)}</span>
      </div>
      <p class="muted">${barber.specialty}</p>
      <ul class="barber-clients">${liContent}</ul>
    `;

    barberGrid.appendChild(card);
  });
}

function renderAgenda() {
  const selectedDate = dateInput.value || todayISO();

  const dailyAgenda = appointments
    .filter((item) => item.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  agendaList.innerHTML = '';

  if (dailyAgenda.length === 0) {
    agendaList.innerHTML = '<li>No hay citas registradas para este día.</li>';
    return;
  }

  dailyAgenda.forEach((item) => {
    const barber = barbers.find((entry) => entry.id === item.barberId);
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${item.time} · ${item.client}</strong>
      <span>${item.service}</span><br />
      <span class="muted">Barbero: ${barber?.name || 'No asignado'}</span>
    `;

    agendaList.appendChild(li);
  });
}

function renderStats() {
  statBarbers.textContent = String(barbers.length);
  statAppointments.textContent = String(
    appointments.filter((item) => item.date === todayISO()).length
  );
  statAvailable.textContent = String(
    barbers.filter((item) => item.status === 'available').length
  );
}

function populateBarberSelect() {
  barberSelect.innerHTML = '';

  barbers.forEach((barber) => {
    const option = document.createElement('option');
    option.value = barber.id;
    option.textContent = `${barber.name} · ${barber.specialty}`;
    barberSelect.appendChild(option);
  });
}

function setFeedback(message, isError = false) {
  feedback.textContent = message;
  feedback.classList.toggle('error', isError);
}

function statusLabel(status) {
  switch (status) {
    case 'available':
      return 'Disponible';
    case 'busy':
      return 'Ocupado';
    default:
      return 'No disponible';
  }
}

function badgeClass(status) {
  switch (status) {
    case 'available':
      return 'available';
    case 'busy':
      return 'busy';
    default:
      return 'offline';
  }
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}
