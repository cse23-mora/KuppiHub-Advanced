'use client';

import * as React from 'react';
import Snackbar from '@mui/joy/Snackbar';
import Button from '@mui/joy/Button';
import PlaylistAddCheckCircleRoundedIcon from '@mui/icons-material/PlaylistAddCheckCircleRounded';

export default function NotificationSnackbar() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <Snackbar
      variant="soft"
      color="success"
      open={open}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      startDecorator={<PlaylistAddCheckCircleRoundedIcon />}
      endDecorator={
        <Button
          onClick={() => setOpen(false)}
          size="sm"
          variant="soft"
          color="success"
        >
          Dismiss
        </Button>
      }
    >
      23 Batch Electrical Department's Kuppies added.
    </Snackbar>
  );
}
