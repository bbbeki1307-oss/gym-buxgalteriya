import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyB-k0E_GVJQm4rrNBlix6H6_sDmJR9YwoI',
  authDomain: 'gymmanagerpro-4ad64.firebaseapp.com',
  projectId: 'gymmanagerpro-4ad64',
  storageBucket: 'gymmanagerpro-4ad64.firebasestorage.app',
  messagingSenderId: '78492683544',
  appId: '1:78492683544:web:776b64598846b44253226d',
  measurementId: 'G-TC0Y5SP6SW'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const table = document.getElementById('memberList');
const searchInput = document.getElementById('search');

let allMembers = [];

document.getElementById('addBtn').addEventListener('click', addMember);

async function addMember() {
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const fee = Number(document.getElementById('fee').value);
  const paid = Number(document.getElementById('paid').value);

  if (!name || !phone || !fee) {
    alert('Maʼlumotlarni toʼliq kiriting!');
    return;
  }

  await addDoc(collection(db, 'members'), {
    name,
    phone,
    fee,
    paid,
    startDate: new Date().toISOString()
  });

  document.getElementById('name').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('fee').value = '';
  document.getElementById('paid').value = '';
}

window.removeMember = async function(id) {
  if (!confirm('Oʼchirasizmi?')) return;
  await deleteDoc(doc(db, 'members', id));
};

function renderTable() {
  const q = searchInput.value.toLowerCase();
  table.innerHTML = '';

  let totalIncome = 0;
  let debtCount = 0;

  allMembers
    .filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.phone.toLowerCase().includes(q)
    )
    .forEach(m => {
      const remaining = m.fee - m.paid;
      totalIncome += m.paid;

      let statusClass = 'red';
      let statusText = 'QARZDOR';

      if (remaining <= 0) {
        statusClass = 'green';
        statusText = 'TOʼLANGAN';
      } else {
        debtCount++;
      }

      const start = new Date(m.startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + 30);

      const days = Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24));

      let dayClass = 'green';
      let dayText = days + ' kun';

      if (days <= 0) {
        dayClass = 'red';
        dayText = 'Muddati oʼtgan';
      } else if (days <= 3) {
        dayClass = 'yellow';
      }

      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${m.name}</td>
        <td>${m.phone}</td>
        <td>${remaining.toLocaleString()} soʼm</td>
        <td class='${statusClass}'>${statusText}</td>
        <td class='${dayClass}'>${dayText}</td>
        <td><button class='delete-btn' onclick='removeMember("${m.id}")'>🗑 Oʼchirish</button></td>
      `;

      table.appendChild(row);
    });

  document.getElementById('totalMembers').innerText = allMembers.length;
  document.getElementById('totalIncome').innerText = totalIncome.toLocaleString();
  document.getElementById('debtCount').innerText = debtCount;
}

searchInput.addEventListener('input', renderTable);

onSnapshot(collection(db, 'members'), snapshot => {
  allMembers = snapshot.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));

  renderTable();
});
