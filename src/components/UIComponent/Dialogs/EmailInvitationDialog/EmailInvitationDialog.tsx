'use client';
import { useEffect, forwardRef, ReactElement, Ref } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { TransitionProps } from '@mui/material/transitions';
import { EditorProps } from 'react-draft-wysiwyg';
import dynamic from 'next/dynamic';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Add } from 'iconsax-react';
import CircularProgress from '@mui/material/CircularProgress';
import { EmailInvitationLoader, EmailInvitationMainContainer } from './EmailInvitationDialog.styled';
import EmailInvitationCardActions from './EmailInvitationCardActions';
import FormInput from 'components/UIComponent/FormInput';
import IconButton from 'components/@extended/IconButton';
import { UIStyledGrid } from 'views/parameter/OverallPurchaseLimit/OverallPurchaseLimit.styled';
import SelectFormControl from 'components/UIComponent/SelectFormControl/SelectFormControl';
import { EmailInvitationDialogProps } from 'types/dialog';
import useConfig from 'hooks/useConfig';
import useEmailDialogLogic from 'hooks/useEmailDialogLogic';

const Editor = dynamic<EditorProps>(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), { ssr: false });

const Transition = forwardRef((props: TransitionProps & { children: ReactElement }, ref: Ref<unknown>) => (
  <Slide direction="up" ref={ref} {...props} />
));

const EmailInvitationDialog = ({ open, handleClose, selectedEmail, setSelected, setSelectedEmails }: EmailInvitationDialogProps) => {
  const { themeDirection } = useConfig();
  const {
    editorState,
    isLoading,
    isEmailTemplateLoading,
    emailTemplates,
    selectedTemplateId,
    handleSubmit,
    values,
    handleBlur,
    handleChange,
    touched,
    errors,
    isSubmitting,
    handleEditorChange,
    handleTemplateChange,
    handleReset,
    fetchTemplates,
  } = useEmailDialogLogic({
    selectedEmail: selectedEmail || '',
    handleClose,
    setSelected,
    setSelectedEmails,
  });

  useEffect(() => {
    if (open) {
      handleReset();
      if (emailTemplates.length === 0) {
        fetchTemplates();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, fetchTemplates]);

  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative', boxShadow: 'none' }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
            Email Invitation To Participants
          </Typography>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <Add style={{ transform: 'rotate(45deg)' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      {isLoading ? (
        <EmailInvitationLoader>
          <CircularProgress size={30} />
        </EmailInvitationLoader>
      ) : (
        <form onSubmit={handleSubmit}>
          <EmailInvitationMainContainer>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <SelectFormControl
                    label="Email Template"
                    id="emailTemplate"
                    value={selectedTemplateId}
                    onChange={handleTemplateChange}
                    loading={isEmailTemplateLoading}
                    options={emailTemplates?.map((item) => ({
                      value: item.SeqNo,
                      label: item.EmailTempTitle,
                    }))}
                  />
                  <FormInput
                    id="emailList"
                    name="emailList"
                    label="Email List"
                    value={values.emailList}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <FormInput
                    id="emailSubject"
                    name="emailSubject"
                    label={
                      <Typography>
                        Email Subject <span style={{ color: 'red' }}>*</span>
                      </Typography>
                    }
                    value={values.emailSubject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.emailSubject && Boolean(errors.emailSubject)}
                    helperText={touched.emailSubject ? errors.emailSubject : undefined}
                  />
                </Box>
              </Grid>
              <UIStyledGrid themeDirection={themeDirection} item xs={12}>
                <Editor editorState={editorState} onEditorStateChange={handleEditorChange} />
              </UIStyledGrid>
            </Grid>
            <EmailInvitationCardActions {...{ isSubmitting, handleReset, handleClose }} />
          </EmailInvitationMainContainer>
        </form>
      )}
    </Dialog>
  );
};

export default EmailInvitationDialog;
