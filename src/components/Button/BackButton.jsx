import { Button, IconButton } from '@mui/material';
import React from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router';

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <IconButton onClick={() => navigate(-1)}>
      <MdArrowBack size={'35px'} color='black'/>
    </IconButton>
  );
};

export default BackButton;
