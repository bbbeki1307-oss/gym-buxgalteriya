function addMember() {
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const fee = Number(document.getElementById('fee').value) || 0;
  const paid = Number(document.getElementById('paid').value) || 0;

  if (!name || !phone) {
    alert('Ism va telefon raqamini kiriting!');
    return;
  }

  const remaining = fee - paid;

  const table = document.getElementById('memberList');

  const row = document.createElement('tr');
  row.innerHTML =
    '<td>' + name + '</td>' +
    '<td>' + phone + '</td>' +
    '<td>' + fee.toLocaleString() + ' so‘m</td>' +
    '<td>' + paid.toLocaleString() + ' so‘m</td>' +
    '<td>' + remaining.toLocaleString() + ' so‘m</td>';

  table.appendChild(row);

  document.getElementById('name').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('fee').value = '';
  document.getElementById('paid').value = '';
}
const firebaseConfig = {
  apiKey: "AIzaSyB-k0E_GVJQm4rrNBlix6H6_sDmJR9YwoI",
  authDomain: "gymmanagerpro-4ad64.firebaseapp.com",
  projectId: "gymmanagerpro-4ad64",
  storageBucket: "gymmanagerpro-4ad64.firebasestorage.app",
  messagingSenderId: "78492683544",
  appId: "1:78492683544:web:776b64598846b44253226d"
};
