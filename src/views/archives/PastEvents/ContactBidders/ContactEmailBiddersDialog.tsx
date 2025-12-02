'use client';
import { useEffect, forwardRef, ReactElement, Ref } from 'react';
import { Add } from 'iconsax-react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import CircularProgress from '@mui/material/CircularProgress';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import { TransitionProps } from '@mui/material/transitions';
import { EditorProps } from 'react-draft-wysiwyg';
import dynamic from 'next/dynamic';
import ContactBiddersTableHeader from './ContactBiddersTableHeader';
import ContactBiddersTableBody from './ContactBiddersTableBody';
import useConfig from 'hooks/useConfig';
import FormInput from 'components/UIComponent/FormInput';
import IconButton from 'components/@extended/IconButton';
import { UIStyledGrid } from 'views/parameter/OverallPurchaseLimit/OverallPurchaseLimit.styled';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import SelectFormControl from 'components/UIComponent/SelectFormControl/SelectFormControl';
import { ContactEmailBiddersDialogProps } from 'types/dialog';
import {
  EmailInvitationLoader,
  EmailInvitationMainContainer,
} from 'components/UIComponent/Dialogs/EmailInvitationDialog/EmailInvitationDialog.styled';
import DownloadCSVButton from 'components/UIComponent/IconButtons/DownloadCSVButton';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import MainCard from 'components/MainCard';
import { useTableControls } from 'utils/useTableControls';
import EmailInvitationCardActions from 'components/UIComponent/Dialogs/EmailInvitationDialog/EmailInvitationCardActions';
import { GetContactBiddersData } from 'services/archives/pastEvents/types';
import useEmailDialogLogic from 'hooks/useEmailDialogLogic';

const Editor = dynamic<EditorProps>(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), { ssr: false });

const Transition = forwardRef((props: TransitionProps & { children: ReactElement }, ref: Ref<unknown>) => (
  <Slide direction="up" ref={ref} {...props} />
));
const ContactEmailBiddersDialog = ({
  open,
  handleClose,
  selectedEmail,
  setSelectedEmails,
  data,
  loading,
  selected,
  isSelected,
  setSelected,
  handleClick,
  isDownloadAccess,
  handleSelectAllClick,
  handleDownloadPublicisedFile,
}: ContactEmailBiddersDialogProps<GetContactBiddersData>) => {
  const { themeDirection } = useConfig();

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage } = useTableControls('SeqNo');

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
        <>
          <EmailInvitationMainContainer>
            <form onSubmit={handleSubmit}>
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

              <EmailInvitationCardActions isSubmitting={isSubmitting} handleReset={handleReset} handleClose={handleClose} />
            </form>

            <MainCard
              content={false}
              title="Contact Bidders"
              secondary={
                isDownloadAccess &&
                data.length > 0 && (
                  <DownloadCSVButton
                    title="Download Publicised Tender Outcomes File"
                    onClick={handleDownloadPublicisedFile}
                    isLoading={loading.isCircularLoading}
                  />
                )
              }
            >
              <TableContainer sx={{ maxHeight: 430 }}>
                <Table sx={{ minWidth: 750 }} aria-label="sticky table" size="small" stickyHeader>
                  <ContactBiddersTableHeader
                    order={order}
                    orderBy={orderBy}
                    rowCount={data.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <ContactBiddersTableBody
                    data={data}
                    page={page}
                    order={order}
                    orderBy={orderBy}
                    loading={loading}
                    rowsPerPage={rowsPerPage}
                    isSelected={isSelected}
                    handleClick={handleClick}
                  />
                </Table>
              </TableContainer>
              <Divider />
              <TablePagination
                rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ '& p': { m: 0 } }}
              />
            </MainCard>
          </EmailInvitationMainContainer>
        </>
      )}
    </Dialog>
  );
};

export default ContactEmailBiddersDialog;
