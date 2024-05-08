
import Grid from '@mui/material/Grid';
import React from 'react';
import TextField from '@mui/material/TextField';

const styles = {
    recruitmentRoundPage: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
    },
    header: {
      backgroundColor: '#1976d2',
      color: '#fff',
      padding: '0.25rem',
      textAlign: 'left',
    },
    main: {
      padding: '2rem',
    },
    section: {
      marginBottom: '2rem',
    },
    addRoundButton: {
      marginBottom: '1rem',
    },
    table: {
      minWidth: 650,
    },
    tableHeader: {
      backgroundColor: '#f2f2f2',
    },
    viewButton: {
      backgroundColor: '#1976d2',
      color: 'white',
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

const AddRecruitmentRoundPage = () => {
  return (
    <div style={styles.recruitmentRoundPage}>

      <header style={styles.header}>
        <h4>Onboarding: Recruitment Platform</h4>
      </header>

      <main style={styles.main}>
            <h2 style={{textAlign: 'center'}}>
                Create Recruitment Round
            </h2>
      </main>
        <section style={styles.section}>
            <h4 style={{ display: 'flex', alignItems: 'center', paddingLeft: '2rem'  }}>
                Round Name:
                <TextField
                    style={{ marginLeft: '0.5rem' }}
                    variant="outlined"
                    placeholder="Enter round name"
                    size="small"
                />
                <div style={{ flex: 1}} /> {/* This creates a flexible space */}
                Deadline:
                <TextField
                    style={{ marginLeft: '0.5rem', paddingRight: '2rem' }}
                    variant="outlined"
                    placeholder="Enter deadline"
                    size="small"
                />
            </h4>
         
        </section>
    

    
    </div>
  )
}

export default AddRecruitmentRoundPage