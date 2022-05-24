import { Container, Grid } from '@mui/material';
import React from 'react';

const Loader = () => {
  return (
    <Container>
      <Grid
        container
        style={{ height: window.innerHeight - 150 }}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Grid container justifyContent={'center'} diraction={'column'}>
          <div className="lds-hourglass"></div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Loader;
