import React from "react";

const styles = {
  recruitmentRoundPage: {
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  main: {
    padding: '2rem',
  },
  section: {
    marginBottom: '2rem',
  },
  activeRound: {
    border: '1px solid #ccc',
    padding: '1rem',
  },
  inactiveRounds: {
    border: '1px solid #ccc',
    padding: '1rem',
  },
  searchInput: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
    padding: '0.5rem',
  },
  tableRow: {
    borderBottom: '1px solid #ccc',
  },
  tableCell: {
    padding: '0.5rem',
  },
  viewButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

const ViewRecruitmentRoundPage = () => {
  return (
    <div style={styles.recruitmentRoundPage}>
      <header style={styles.header}>
        <h1>Onboarding: Recruitment Platform</h1>
        <input style={styles.searchInput} type="text" placeholder="Search..." />
      </header>

      <main style={styles.main}>
        <h2>Recruitment Rounds</h2>
        <section style={styles.section}>
          <h3>Monash Nova</h3>
          <div style={styles.activeRound}>
            <h4>Active Recruitment Round</h4>
            {/* <input style={styles.searchInput} type="text" placeholder="Round Name, Deadline, etc..." /> */}
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />

            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.tableCell}>Round Name</th>
                  <th style={styles.tableCell}>Deadline</th>
                  <th style={styles.tableCell}>Status</th>
                  <th style={styles.tableCell}>Semester</th>
                  <th style={styles.tableCell}>Openings</th>
                  <th style={styles.tableCell}></th>
                </tr>
              </thead>
              <tbody>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>Monash Nova Rover Recruitment 12</td>
                  <td style={styles.tableCell}>20/04/2024</td>
                  <td style={styles.tableCell}>
                    <span style={{ color: 'green' }}>Active</span>
                  </td>
                  <td style={styles.tableCell}>Semester 1</td>
                  <td style={styles.tableCell}>5</td>
                  <td style={styles.tableCell}>
                    <button style={styles.viewButton}>VIEW</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={styles.inactiveRounds}>
            <h4>Inactive Recruitment Rounds</h4>
            <input style={styles.searchInput} type="text" placeholder="Round Name, Deadline, etc..." />
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.tableCell}>Round Name</th>
                  <th style={styles.tableCell}>Deadline</th>
                  <th style={styles.tableCell}>Status</th>
                  <th style={styles.tableCell}>Semester</th>
                  <th style={styles.tableCell}>Openings</th>
                  <th style={styles.tableCell}></th>
                </tr>
              </thead>
              <tbody>
                {/* Add your inactive round rows here */}
              </tbody>
            </table>
          </div>
        </section>
        <section style={styles.section}>
          <h3>Archived Recruitment Rounds</h3>
          <input style={styles.searchInput} type="text" placeholder="Round Name, Deadline, etc..." />
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableCell}>Round Name</th>
                <th style={styles.tableCell}>Deadline</th>
                <th style={styles.tableCell}>Status</th>
                <th style={styles.tableCell}>Semester</th>
                <th style={styles.tableCell}>Openings</th>
                <th style={styles.tableCell}></th>
              </tr>
            </thead>
            <tbody>
              {/* Add your archived round rows here */}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default ViewRecruitmentRoundPage;