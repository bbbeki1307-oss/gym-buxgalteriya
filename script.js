import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyB-k0E_GVJQm4rrNBlix6H6_sDmJR9YwoI",
  authDomain: "gymmanagerpro-4ad64.firebaseapp.com",
  projectId: "gymmanagerpro-4ad64",
  storageBucket: "gymmanagerpro-4ad64.firebasestorage.app",
  messagingSenderId: "78492683544",
  appId: "1:78492683544:web:776b64598846b44253226d",
  measurementId: "G-TC0Y5SP6SW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.addMember = async function () {
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const fee = Number(document.getElementById('fee').value);
  const paid = Number(document.getElementById('paid').value);

  if (!name || !phone || !fee) {
    alert('Ma'lumotlarni to'liq kiriting');
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
};

const table = document.getElementById('memberList');

onSnapshot(collection(db, 'members'), snapshot => {
  table.innerHTML = '';

  snapshot.forEach(d => {
    const m = d.data();
    const remaining = m.fee - m.paid;

    let statusClass = 'red';
    let statusText = 'QARZDOR';

    if (remaining <= 0) {
      statusClass = 'green';
      statusText = 'TO'LANGAN';
    }

    const start = new Date(m.startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 30);

    const days = Math.ceil((end - new Date()) / (1000*60*60*24));

    let dayClass = 'green';
    let dayText = days + ' kun';

    if (days <= 0) {
      dayClass = 'red';
      dayText = 'Muddati o'tgan';
    } else if (days <= 3) {
      dayClass = 'yellow';
    }

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${m.name}</td>
      <td>${m.phone}</td>
      <td>${remaining}</td>
      <td class="${statusClass}">${statusText}</td>
      <td class="${dayClass}">${dayText}</td>
      <td><button onclick="removeMember('${d.id}')">🗑</button></td>
    `;

    table.appendChild(row);
  });
});

window.removeMember = async function(id) {
  await deleteDoc(doc(db, 'members', id));
};
