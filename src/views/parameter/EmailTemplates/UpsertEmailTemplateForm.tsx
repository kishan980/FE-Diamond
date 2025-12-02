'use client';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import CardContent from '@mui/material/CardContent';
import FormHelperText from '@mui/material/FormHelperText';
import dynamic from 'next/dynamic';
import { EditorProps } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';
import { UIStyledGrid } from '../OverallPurchaseLimit/OverallPurchaseLimit.styled';
import { UpsertDocumentDescMainContainer } from '../LegalDocument/UpsertLegalDocument.styled';
import { UpsertEmailBodyContainer, UpsertEmailMainContainer } from './UpsertEmailTemplate.styled';
import Loader from 'components/Loader';
import useConfig from 'hooks/useConfig';
import MainCard from 'components/MainCard';
import FormInput from 'components/UIComponent/FormInput';
import CardActionButtons from 'components/UIComponent/CardActionButton';
import { ViewMainContainer } from 'views/event/Event.styled';
import { emailTemplateSchema } from 'validations/validationSchemas';
import { EmailTemplateServices } from 'services/parameter/emailTemplate/emailTemplate.services';
import { AddEmailTemplateParams, EmailTemplateByIdData } from 'services/parameter/emailTemplate/type';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { LoadingState } from 'types/table';
import CircularLoader from 'components/CircularLoader';

const Editor = dynamic<EditorProps>(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), { ssr: false });

const UpsertEmailTemplateForm = () => {
  const { push } = useRouter();
  const { themeDirection } = useConfig();
  const { id } = useParams();
  const emailTemplateId = Number(id);

  const [emailTemplateData, setEmailTemplateData] = useState<EmailTemplateByIdData>();
  const [editorState, setEditorState] = useState<EditorState>(() => EditorState.createEmpty());
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false });

  const initialValues = { emailSubject: '', emailBody: '' };

  const { errors, values, touched, handleChange, setSubmitting, handleBlur, setValues, handleSubmit, setFieldValue, isSubmitting } =
    useFormik({
      initialValues,
      validationSchema: emailTemplateSchema,
      onSubmit: (values) => {
        // eslint-disable-next-line no-use-before-define
        return handleSubmitForm(values);
      },
    });

  const fetchEmailTemplateById = useCallback(async (id: number) => {
    setLoading((prev) => ({ ...prev, isProgress: true }));
    try {
      const res = await EmailTemplateServices.getEmailTemplateById(id);
      if (typeof res !== 'string' && res.success) setEmailTemplateData(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching email getbyId data:', error);
      toast.error('Error fetching email getbyId data.');
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: false }));
    }
  }, []);

  const handleEditorChange = (editorState: EditorState) => {
    setEditorState(editorState);
    const contentState = editorState.getCurrentContent();
    const htmlContent = stateToHTML(contentState);
    setFieldValue('emailBody', htmlContent);
  };

  const handleReset = () => {
    setValues(initialValues);
    setEditorState(EditorState.createEmpty());
  };

  const handleSubmitForm = async (values: AddEmailTemplateParams) => {
    try {
      const res = emailTemplateId
        ? await EmailTemplateServices.updateEmailTemplate({ ...values, id: emailTemplateId })
        : await EmailTemplateServices.addEmailTemplate(values);

      if (typeof res !== 'string' && res.success) {
        toast.success(`Email Template ${emailTemplateId ? 'updated' : 'added'} successfully`);
        push('/master-setup/email-templates');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while saving the Email Template:', error);
      toast.error('An error occurred while saving the Email Template.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (emailTemplateId) fetchEmailTemplateById(emailTemplateId);
  }, [emailTemplateId, fetchEmailTemplateById]);

  useEffect(() => {
    if (emailTemplateData) {
      setValues({
        emailSubject: emailTemplateData?.EmailSubject || '',
        emailBody: emailTemplateData?.EmailBody || '',
      });
      if (emailTemplateData?.EmailBody) {
        const contentState = stateFromHTML(emailTemplateData.EmailBody);
        setEditorState(EditorState.createWithContent(contentState));
      } else setEditorState(EditorState.createEmpty());
    }
  }, [emailTemplateData, setValues]);

  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <>
      {(loading.isProgress || loading.isLoading) && <CircularLoader isProgress={loading.isProgress || loading.isLoading} />}
      <form onSubmit={handleSubmit}>
        <ViewMainContainer>
          <MainCard title={`${emailTemplateId ? 'Update' : 'Add'} Email Templates`} content={false}>
            <CardContent>
              <UpsertDocumentDescMainContainer>
                <UpsertEmailMainContainer>
                  <FormInput
                    id="emailSubject"
                    name="emailSubject"
                    label="Subject"
                    required
                    value={values.emailSubject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.emailSubject && Boolean(errors.emailSubject)}
                    helperText={touched.emailSubject ? errors.emailSubject : undefined}
                  />
                  <Grid container>
                    <UIStyledGrid themeDirection={themeDirection} item xs={12}>
                      <UpsertEmailBodyContainer>
                        <InputLabel>
                          Email body <span style={{ color: 'red' }}>*</span>
                        </InputLabel>
                        <Editor editorState={editorState} onEditorStateChange={handleEditorChange} />
                        {errors.emailBody && touched.emailBody && <FormHelperText error>{errors.emailBody}</FormHelperText>}
                      </UpsertEmailBodyContainer>
                    </UIStyledGrid>
                  </Grid>
                </UpsertEmailMainContainer>
              </UpsertDocumentDescMainContainer>
            </CardContent>
          </MainCard>
          <CardActionButtons isSubmitting={isSubmitting} id={emailTemplateId} handleReset={handleReset} />
        </ViewMainContainer>
      </form>
    </>
  );
};

export default UpsertEmailTemplateForm;
