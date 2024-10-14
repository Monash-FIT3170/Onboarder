import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import PermissionButton from "./PermissionButton";

interface ConfigureInterviewLinkModalProps {
  open: boolean;
  onClose: () => void;
  onEditLink: (urlLink: string) => void;
  urlLinkIn: string;
}

const ConfigureInterviewLinkModal: React.FC<
  ConfigureInterviewLinkModalProps
> = ({ open, onClose, onEditLink, urlLinkIn }) => {
  const [urlLink, setUrlLink] = useState(urlLinkIn);
  //   setUrlLink(urlLinkIn);
  console.log(urlLinkIn);
  const handleEditLink = () => {
    onEditLink(urlLink);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configure Interview Link</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h3 style={{ fontWeight: "normal" }}>Enter URL Here (Optional):</h3>
            <TextField
              placeholder="https://zoom-example.com"
              id="outlined-multiline-static"
              label="Global Meeting URL"
              fullWidth
              variant="filled"
              value={urlLinkIn}
              //   defaultValue={urlLinkIn}
              onChange={(e) => setUrlLink(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" component="p" paragraph>
              Onboarder does not generate zoom/meeting links.
              <br />
              To add a global/reusable meeting link, please enter the link here.
              <br />
              This will be used as meeting link for all interviews that your
              team conducts.
              <br />
              Alternatively, you can assign individual links on Google Calendar
              after you have sent out the event invites.
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <PermissionButton
          action="update"
          subject="Interview"
          variant="contained"
          onClick={handleEditLink}
          tooltipText="You do not have permission to update the interview link"
        >
          Save
        </PermissionButton>
        <Button variant="contained" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfigureInterviewLinkModal;
