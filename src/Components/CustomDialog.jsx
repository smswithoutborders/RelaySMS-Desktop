import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

function CustomDialog({ open, onClose, title, description, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Typography>{description}</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        No
      </Button>
      <Button onClick={onConfirm} color="primary" autoFocus>
        Yes
      </Button>
    </DialogActions>
  </Dialog>
  )
}

export default CustomDialog