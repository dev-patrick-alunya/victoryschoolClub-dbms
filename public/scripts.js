document.addEventListener('DOMContentLoaded', () => {
  function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.textContent = 'Congratulations, your update was successful!';
    successMessage.style.position = 'fixed';
    successMessage.style.top = '10px';
    successMessage.style.right = '10px';
    successMessage.style.backgroundColor = '#4CAF50';
    successMessage.style.color = 'white';
    successMessage.style.padding = '10px';
    successMessage.style.borderRadius = '5px';
    document.body.appendChild(successMessage);
    setTimeout(() => {
      document.body.removeChild(successMessage);
    }, 1000);
  }

  function redirectToIndex() {
    window.location.href = 'index.html';
  }
  const content = document.getElementById('content');

  const clubsLink = document.getElementById('clubs-link');
  const patronsLink = document.getElementById('patrons-link');
  const membersLink = document.getElementById('members-link');
  const activitiesLink = document.getElementById('activities-link');
  const financesLink = document.getElementById('finances-link');
  const pastMembersLink = document.getElementById('past-members-link');
  const newMembersLink = document.getElementById('new-members-link');
  const savingsLink = document.getElementById('savings-link');
  const financialSummaryLink = document.getElementById('financial-summary-link');
  const activityReportLink = document.getElementById('activity-report-link');
  // const reportsLink = document.getElementById('financial-summary');

  if (clubsLink) clubsLink.addEventListener('click', () => loadTable('clubs'));
  if (patronsLink) patronsLink.addEventListener('click', () => loadTable('patrons'));
  if (membersLink) membersLink.addEventListener('click', () => loadTable('members'));
  if (activitiesLink) activitiesLink.addEventListener('click', () => loadTable('club_activities'));
  if (financesLink) financesLink.addEventListener('click', () => loadTable('club_finances'));
  if (pastMembersLink) pastMembersLink.addEventListener('click', () => loadTable('past_members'));
  if (newMembersLink) newMembersLink.addEventListener('click', () => loadTable('new_members'));
  if (savingsLink) savingsLink.addEventListener('click', loadSavings);
  if (financialSummaryLink) financialSummaryLink.addEventListener('click', loadFinancialSummary);
  if (activityReportLink) activityReportLink.addEventListener('click', loadActivityReport);
  // if (reportsLink) reportsLink.addEventListener('click', loadReports);

  function loadTable(tableName) {
    fetch(`https://victoryschoolclub-dbms.onrender.com/${tableName}`)
      .then(response => {
        if (!response.ok) {
          console.error(`Network response was not ok: ${response.status} ${response.statusText}`);
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (content) {
          content.innerHTML = generateTableHTML(data, tableName);
        } else {
          console.error('Content element not found');
        }
      })
      .catch(error => console.error('Error loading data:', error));
  }

  function generateTableHTML(data, tableName) {
    if (data.length === 0) return '<p>No data available</p>';

    const headers = Object.keys(data[0]);
    const rows = data.map(row => {
      return `<tr>${headers.map(header => `<td>${row[header]}</td>`).join('')}
        <td>
          <button onclick="editRecord('${tableName}', ${row[headers[0]]})">Edit</button>
          <button onclick="deleteRecord('${tableName}', ${row[headers[0]]})">Delete</button>
        </td>
      </tr>`;
    }).join('');

    return `
      <div style="display: flex; justify-content: center;">
        <table>
          <style>
          table {
              text-align: left;
              border: 1px solid black;
            }
            th, td {
              padding: 12px;
              border: 2px solid #ddd;
            }
            th {
              background-color: #f2f2f2;
              color: #333;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            tr:hover {
              background-color: #f1f1f1;
            }
          </style>
          <thead>
            <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }

  function editRecord(tableName, id) {
    fetch(`https://victoryschoolclub-dbms.onrender.com/${tableName}/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        // Populate the form with the record data
        for (const key in data) {
          const input = document.getElementById(`${tableName.toLowerCase()}_${key}`);
          if (input) {
            input.value = data[key];
          }
        }
        // Show the form
        const form = document.getElementById(`${tableName.toLowerCase()}-form`);
        if (form) {
          form.style.display = 'block';
        } else {
          console.error('Form element not found');
        }
      })
      .catch(error => console.error('Error fetching record:', error));
  }
  window.editRecord = editRecord; // Expose to global scope

    function deleteRecord(tableName, id) {
      // Confirm deletion
      if (confirm('Are you sure you want to delete this record?')) {
        // Delete the record
        fetch(`https://victoryschoolclub-dbms.onrender.com/${tableName}/${id}`, {
          method: 'DELETE'
        })
          .then(response => response.json())
          .then(data => {
            console.log('Record deleted:', data);
            loadTable(tableName);
            showSuccessMessage();
            redirectToIndex();
          })
          .catch(error => console.error('Error deleting record:', error));
      }
    }
  window.deleteRecord = deleteRecord; // Expose to global scope
  

  function loadSavings() {
    fetch('https://victoryschoolclub-dbms.onrender.com/club-savings')
      .then(response => response.json())
      .then(data => {
        if (content) {
          content.innerHTML = generateSavingsHTML(data);
          renderBarGraph(data, 'savings', 'Club Savings');
          renderPieChart(data, 'savings', 'Club Savings Distribution');
        } else {
          console.error('Content element not found');
        }
      })
      .catch(error => console.error('Error loading savings:', error));
  }

  function generateSavingsHTML(data) {
    if (data.length === 0) return '<p>No savings data available</p>';

    const headers = Object.keys(data[0]);
    const rows = data.map(row => {
      return `<tr>${headers.map(header => `<td>${row[header]}</td>`).join('')}</tr>`;
    }).join('');

    return `
      <div style="display: flex; justify-content: center;">
        <table>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 18px;
              text-align: left;
            }
            th, td {
              padding: 12px;
              border: 1px solid #ddd;
            }
            th {
              background-color: #f2f2f2;
              color: #333;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            tr:hover {
              background-color: #f1f1f1;
            }
          </style>
          <thead>
            <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }

  function loadFinancialSummary() {
    fetch('https://victoryschoolclub-dbms.onrender.com/financial-summary')
      .then(response => response.json())
      .then(data => {
        if (content) {
          content.innerHTML = generateFinancialSummaryHTML(data);
          renderBarGraph(data, 'net_balance', 'Financial Summary');
          renderPieChart(data, 'net_balance', 'Financial Summary Distribution');
          renderScoreCards(data);
        } else {
          console.error('Content element not found');
        }
      })
      .catch(error => console.error('Error loading financial summary:', error));
  }

  function generateFinancialSummaryHTML(data) {
    if (data.length === 0) return '<p>No financial summary available</p>';

    const headers = Object.keys(data[0]);
    const rows = data.map(row => {
      return `<tr>${headers.map(header => `<td>${row[header]}</td>`).join('')}</tr>`;
    }).join('');

    return `
      <div style="display: flex; justify-content: center;">
        <table>
          <style>
            table {
              width: 100%;
              margin: 20px 0;
              font-size: 18px;
              text-align: left;
              border: 2px solid blue;
            }
            th, td {
              padding: 12px;
              border: 1px solid #ddd;
            }
            th {
              background-color: #f2f2f2;
              color: #333;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            tr:hover {
              background-color: #f1f1f1;
            }
          </style>
          <thead>
            <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }

  function loadActivityReport() {
    fetch('https://victoryschoolclub-dbms.onrender.com/activity-report')
      .then(response => response.json())
      .then(data => {
        if (content) {
          content.innerHTML = generateActivityReportHTML(data);
          renderBarGraph(data, 'activity_name', 'Activity Report');
          renderPieChart(data, 'activity_name', 'Activity Report Distribution');
        } else {
          console.error('Content element not found');
        }
      })
      .catch(error => console.error('Error loading activity report:', error));
  }

  function generateActivityReportHTML(data) {
    if (data.length === 0) return '<p>No activity report available</p>';

    const headers = Object.keys(data[0]);
    const rows = data.map(row => {
      return `<tr>${headers.map(header => `<td>${row[header]}</td>`).join('')}</tr>`;
    }).join('');

    return `
      <div style="display: flex; justify-content: center;">
        <table>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 18px;
              text-align: left;
            }
            th, td {
              padding: 12px;
              border: 1px solid #ddd;
            }
            th {
              background-color: #f2f2f2;
              color: #333;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            tr:hover {
              background-color: #f1f1f1;
            }
          </style>
          <thead>
            <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderBarGraph(data, key, title) {
    const labels = data.map(item => item.club_name || item.activity_name);
    const values = data.map(item => item[key]);

    const canvas = document.createElement('canvas');
    content.appendChild(canvas);

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: title,
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  function renderPieChart(data, key, title) {
    const labels = data.map(item => item.club_name || item.activity_name);
    const values = data.map(item => item[key]);

    const canvas = document.createElement('canvas');
    content.appendChild(canvas);

    new Chart(canvas, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: title,
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      }
    });
  }

  function renderScoreCards(data) {
    const totalIncome = data.reduce((sum, item) => sum + item.total_income, 0);
    const totalSavings = data.reduce((sum, item) => sum + item.total_savings, 0);
    const netBalance = data.reduce((sum, item) => sum + item.net_balance, 0);

    const scoreCardHTML = `
      <div style="display: flex; justify-content: space-around; margin: 20px 0;">
        <div style="background-color: #4CAF50; color: white; padding: 20px; border-radius: 5px;">
          <h3>Total Income</h3>
          <p>${totalIncome}</p>
        </div>
        <div style="background-color: #2196F3; color: white; padding: 20px; border-radius: 5px;">
          <h3>Total Savings</h3>
          <p>${totalSavings}</p>
        </div>
        <div style="background-color: #FF9800; color: white; padding: 20px; border-radius: 5px;">
          <h3>Net Balance</h3>
          <p>${netBalance}</p>
        </div>
      </div>
    `;

    content.insertAdjacentHTML('beforeend', scoreCardHTML);
  }

  // function loadReports() {
  //   fetch('http://localhost:3000/activity-report')
  //     .then(response => response.json())
  //     .then(data => {
  //       if (content) {
  //         content.innerHTML = generateReportsHTML(data);
  //       } else {
  //         console.error('Content element not found');
  //       }
  //     })
  //     .catch(error => console.error('Error loading reports:', error));
  // }

  // function generateReportsHTML(data) {
  //   if (!data || data.length === 0) return '<p>No Financial Summary available</p>';

  //   const headers = Object.keys(data[0]);
  //   const rows = data.map(row => {
  //     return `<tr>${headers.map(header => `<td>${row[header]}</td>`).join('')}</tr>`;
  //   }).join('');

  //   return `
  //     <div style="display: flex; justify-content: center;">
  //       <table>
  //         <style>
  //           table {
  //             width: 100%;
  //             border-collapse: collapse;
  //             margin: 20px 0;
  //             font-size: 18px;
  //             text-align: left;
  //           }
  //           th, td {
  //             padding: 12px;
  //             border: 1px solid #ddd;
  //           }
  //           th {
  //             background-color: #f2f2f2;
  //             color: #333;
  //           }
  //           tr:nth-child(even) {
  //             background-color: #f9f9f9;
  //           }
  //           tr:hover {
  //             background-color: #f1f1f1;
  //           }
  //         </style>
  //         <thead>
  //           <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
  //         </thead>
  //         <tbody>
  //           ${rows}
  //         </tbody>
  //       </table>
  //     </div>
  //   `;
  // }

  

  // Handle form submissions
  document.getElementById('club-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const clubData = {
      club_name: document.getElementById('club_name').value,
      club_patron: document.getElementById('club_patron').value,
      club_revenue_activity: document.getElementById('club_revenue_activity').value,
      club_revenue_date: document.getElementById('club_revenue_date').value,
      club_revenue_amount: document.getElementById('club_revenue_amount').value
    };
    fetch('https://victoryschoolclub-dbms.onrender.com/clubs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clubData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Club added:', data);
      loadTable('Clubs');
      showSuccessMessage();
      redirectToIndex();
    })
    .catch(error => console.error('Error adding club:', error));
  });

  // Add similar event listeners for other forms (Patrons, Members, Activities, Finances)
  document.getElementById('patron-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const patronData = {
      patron_name: document.getElementById('patron_name').value,
      patron_role: document.getElementById('patron_role').value
    };
    fetch('https://victoryschoolclub-dbms.onrender.com/patrons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patronData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Patron added:', data);
      loadTable('Patrons');
      showSuccessMessage();
      redirectToIndex();
    })
    .catch(error => console.error('Error adding patron:', error));
  });

  document.getElementById('member-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const memberData = {
      member_name: document.getElementById('member_name').value,
      member_class: document.getElementById('member_class').value,
      member_admission_number: document.getElementById('member_admission_number').value,
      member_club: document.getElementById('member_club').value,
      member_role: document.getElementById('member_role').value
    };
    fetch('https://victoryschoolclub-dbms.onrender.com/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(memberData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Member added:', data);
      loadTable('Members');
      showSuccessMessage();
      redirectToIndex();
    })
    .catch(error => console.error('Error adding member:', error));
  });

  document.getElementById('activity-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const activityData = {
      activity_name: document.getElementById('activity_name').value,
      activity_date: document.getElementById('activity_date').value,
      club_id: document.getElementById('club_id').value,
      activity_description: document.getElementById('activity_description').value
    };
    fetch('https://victoryschoolclub-dbms.onrender.com/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(activityData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Activity added:', data);
      loadTable('Club_Activities');
      showSuccessMessage();
      redirectToIndex();
    })
    .catch(error => console.error('Error adding activity:', error));
  });

  document.getElementById('finance-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const financeData = {
      finance_description: document.getElementById('finance_description').value,
      finance_amount: document.getElementById('finance_amount').value,
      finance_date: document.getElementById('finance_date').value,
      club_id: document.getElementById('club_id').value
    };
    fetch('https://victoryschoolclub-dbms.onrender.com/finances', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(financeData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Finance added:', data);
      loadTable('Club_Finances');
      showSuccessMessage();
      redirectToIndex();
    })
    .catch(error => console.error('Error adding finance:', error));
  });

  // Handle form submissions for new members
  document.getElementById('new-member-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const newMemberData = {
      member_name: document.getElementById('new_member_name').value,
      member_class: document.getElementById('new_member_class').value,
      member_admission_number: document.getElementById('new_member_admission_number').value,
      member_club: document.getElementById('new_member_club').value,
      member_role: document.getElementById('new_member_role').value,
      academic_year: document.getElementById('new_member_academic_year').value
    };
    fetch('https://victoryschoolclub-dbms.onrender.com/new-members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMemberData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('New member added:', data);
      loadTable('New_Members');
      showSuccessMessage();
      redirectToIndex();
    })
    .catch(error => console.error('Error adding new member:', error));
  });

  // Handle form submissions for past members
  document.getElementById('past-member-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const pastMemberData = {
      member_name: document.getElementById('past_member_name').value,
      member_class: document.getElementById('past_member_class').value,
      member_admission_number: document.getElementById('past_member_admission_number').value,
      member_club: document.getElementById('past_member_club').value,
      member_role: document.getElementById('past_member_role').value,
      academic_year: document.getElementById('past_member_academic_year').value
    };
    fetch('https://victoryschoolclub-dbms.onrender.com/past-members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pastMemberData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Past member added:', data);
      loadTable('Past_Members');
      showSuccessMessage();
      redirectToIndex();
    })
    .catch(error => console.error('Error adding past member:', error));
  });
});
