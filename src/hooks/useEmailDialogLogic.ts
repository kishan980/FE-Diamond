import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { EditorState } from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';
import { SelectChangeEvent } from '@mui/material/Select';
import { EmailTemplateServices } from 'services/parameter/emailTemplate/emailTemplate.services';
import { EmailTemplateByIdData, EmailTemplateData } from 'services/parameter/emailTemplate/type';
import { EventServices } from 'services/event/event.services';
import { AddSendMailParams } from 'services/event/types';
import { emailInvitationSchema } from 'validations/validationSchemas';

interface UseEmailDialogLogicProps {
  selectedEmail: string;
  handleClose: () => void;
  setSelected: Dispatch<SetStateAction<number[]>>;
  setSelectedEmails: (emails: string[]) => void;
  isSelectionRequired?: boolean;
  selectedCount?: number;
}

const initialValues = {
  emailTemplate: '',
  emailList: '',
  emailSubject: '',
  emailBody: '',
};

export const useEmailDialogLogic = ({
  selectedEmail,
  handleClose,
  setSelected,
  setSelectedEmails,
  isSelectionRequired = false,
  selectedCount = 0,
}: UseEmailDialogLogicProps) => {
  const [editorState, setEditorState] = useState<EditorState>(() => EditorState.createEmpty());
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailTemplateLoading, setIsEmailTemplateLoading] = useState(false);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplateData[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | number>('');
  const [selectedTemplateData, setSelectedTemplateData] = useState<EmailTemplateByIdData | undefined>(undefined);

  const {
    handleSubmit,
    setFieldValue,
    setValues,
    values,
    resetForm,
    handleBlur,
    handleChange,
    touched,
    errors,
    isSubmitting,
    setSubmitting,
  } = useFormik({
    initialValues: { ...initialValues, emailList: selectedEmail || '' },
    validationSchema: emailInvitationSchema,
    enableReinitialize: true,
    onSubmit: () => {
      // eslint-disable-next-line no-use-before-define
      return handleSubmitForm();
    },
  });

  const fetchTemplates = useCallback(async () => {
    setIsEmailTemplateLoading(true);
    try {
      const res = await EmailTemplateServices.emailTemplateListData();
      if (typeof res !== 'string' && res?.success) setEmailTemplates(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while fetching templates', error);
      toast.error('An error occurred while fetching templates');
    } finally {
      setIsEmailTemplateLoading(false);
    }
  }, []);

  const fetchTemplateDetails = useCallback(async (id: number) => {
    setIsLoading(true);
    setSelectedTemplateData(undefined);
    try {
      const res = await EmailTemplateServices.getEmailTemplateById(id);
      if (typeof res !== 'string' && res.success) {
        setSelectedTemplateData(res.data);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while fetching template details', error);
      toast.error('An error occurred while fetching template details');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmitForm = async () => {
    if (isSelectionRequired && selectedCount === 0) {
      toast.warning('Please select at least one lot');
      setSubmitting(false);
      return;
    }

    const params: AddSendMailParams = {
      emailIds: selectedEmail,
      emailSubject: selectedTemplateData?.EmailSubject ?? '',
      emailBody: selectedTemplateData?.EmailBody ?? '',
    };

    try {
      const res = await EventServices.sendEmailInvitation(params);
      if (typeof res !== 'string' && res.success) {
        toast.success(res.data);
        setSelectedEmails([]);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while submitting the form', error);
      toast.error('An error occurred while submitting the form');
    } finally {
      setSelected([]);
      setSubmitting(false);
      handleClose();
    }
  };

  const handleEditorChange = (editorState: EditorState) => {
    setEditorState(editorState);
    const htmlContent = stateToHTML(editorState.getCurrentContent());
    setFieldValue('emailBody', htmlContent);
  };

  const handleTemplateChange = (event: SelectChangeEvent<number | string | boolean>) => {
    const selectedValue = event.target.value as string | number;
    setSelectedTemplateId(selectedValue);
    fetchTemplateDetails(Number(selectedValue));
  };

  const handleReset = () => {
    resetForm();
    setEditorState(EditorState.createEmpty());
    setSelectedTemplateId('');
    setSelectedTemplateData(undefined);
  };

  useEffect(() => {
    setValues({
      ...values,
      emailList: selectedEmail,
      emailSubject: selectedTemplateData?.EmailSubject || '',
      emailBody: selectedTemplateData?.EmailBody || '',
    });

    if (selectedTemplateData?.EmailBody) {
      const contentState = stateFromHTML(selectedTemplateData.EmailBody);
      setEditorState(EditorState.createWithContent(contentState));
    } else {
      setEditorState(EditorState.createEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplateData, selectedEmail]);

  return {
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
    setSubmitting,
    handleEditorChange,
    handleTemplateChange,
    handleReset,
    fetchTemplates,
  };
};

export default useEmailDialogLogic;
