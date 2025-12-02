'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import InputLabel from '@mui/material/InputLabel';
import CardContent from '@mui/material/CardContent';
import FormHelperText from '@mui/material/FormHelperText';
import {
  TermsAndConditionFormMainContainer,
  TermsAndConditionFormContainer,
  TermsAndConditionDragPdf,
} from './UpsertTermsAndCondition.styled';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import FormInput from 'components/UIComponent/FormInput';
import CardActionButtons from 'components/UIComponent/CardActionButton';
import DragAndDropSinglePDF from 'components/UIComponent/DragAndDropSinglePDF';
import { ViewMainContainer } from 'views/event/Event.styled';
import { termsAndConditionsSchema } from 'validations/validationSchemas';
import { handleFetchData } from 'utils/apiHelpers';
import { TermsAndConditionServices } from 'services/parameter/termsAndCondition/termsAndCondition.services';
import { LoadingState } from 'types/table';
import { AddTermsAndConditionParams, TermsAndConditionByIdData } from 'services/parameter/termsAndCondition/type';
import CircularLoader from 'components/CircularLoader';

const UpsertTermsAndConditionForm = () => {
  const { push } = useRouter();
  const { id } = useParams();
  const termAndConditionId = Number(id);

  const [termAndConditionData, setTermsAndConditionData] = useState<TermsAndConditionByIdData>();
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false });

  const initialValues: AddTermsAndConditionParams = { title: '', termsConditionDoc: '', terminal: window.location.origin };

  const {
    errors,
    values,
    touched,
    handleBlur,
    setSubmitting,
    handleChange,
    handleReset,
    handleSubmit,
    setFieldValue,
    setValues,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema: termsAndConditionsSchema,
    onSubmit: (values) => {
      // eslint-disable-next-line no-use-before-define
      return handleSubmitForm(values);
    },
  });

  const handleAddTermsAndCondition = async (values: AddTermsAndConditionParams) => {
    try {
      const res = termAndConditionId
        ? await TermsAndConditionServices.updateTermsAndCondition({ ...values, id: termAndConditionId })
        : await TermsAndConditionServices.addTermsAndCondition({
            ...values,
            termsConditionDoc: values.termsConditionDoc as string,
          });
      if (typeof res !== 'string' && res.success) {
        push('/master-setup/term-and-condition');
        toast.success('Term & condition ' + (termAndConditionId ? 'updated' : 'added') + ' successfully');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while saving the Terms & Conditions:', error);
      toast.error('An error occurred while saving the Terms & Conditions.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitForm = async (values: AddTermsAndConditionParams) => {
    try {
      if (typeof values.termsConditionDoc !== 'string') {
        const uploadRes = await TermsAndConditionServices.uploadImage({
          file: values.termsConditionDoc[0],
          oldFile: termAndConditionData?.Description ?? null,
        });

        if (typeof uploadRes !== 'string' && uploadRes.success) {
          values.termsConditionDoc = uploadRes.data;
        } else {
          throw new Error('PDF upload failed.');
        }
      }

      await handleAddTermsAndCondition(values);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.error('An error occurred while submitting the form.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGetSellingById = async (id: number) =>
    await handleFetchData<TermsAndConditionByIdData | undefined>(
      () => TermsAndConditionServices.getTermsAndConditionById(id),
      setTermsAndConditionData,
      setLoading
    );

  useEffect(() => {
    if (termAndConditionId) handleGetSellingById(termAndConditionId);
  }, [termAndConditionId]);

  useEffect(() => {
    if (termAndConditionId && termAndConditionData) {
      setValues({
        title: termAndConditionData.Title ?? '',
        termsConditionDoc: termAndConditionData.Description ?? '',
        terminal: window.location.origin,
      });
    }
  }, [termAndConditionId, termAndConditionData, setValues]);

  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <>
      {loading.isProgress && <CircularLoader isProgress={loading.isProgress} />}
      <form onSubmit={handleSubmit}>
        <ViewMainContainer>
          <MainCard title={`${termAndConditionId ? 'Update' : 'Add'} Term & Condition`} content={false}>
            <CardContent>
              <TermsAndConditionFormMainContainer>
                <TermsAndConditionFormContainer>
                  <FormInput
                    id="title"
                    name="title"
                    label="Title"
                    required
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title ? errors.title : undefined}
                  />
                  <TermsAndConditionDragPdf>
                    <InputLabel>
                      Term & condition <span style={{ color: 'red' }}>*</span>
                    </InputLabel>
                    <DragAndDropSinglePDF
                      name="termsConditionDoc"
                      setFieldValue={setFieldValue}
                      file={values.termsConditionDoc}
                      error={touched.termsConditionDoc && Boolean(errors.termsConditionDoc)}
                    />
                    {touched.termsConditionDoc && errors.termsConditionDoc && (
                      <FormHelperText error>{errors.termsConditionDoc.toString()}</FormHelperText>
                    )}
                  </TermsAndConditionDragPdf>
                </TermsAndConditionFormContainer>
              </TermsAndConditionFormMainContainer>
            </CardContent>
          </MainCard>
          <CardActionButtons isSubmitting={isSubmitting} id={termAndConditionId} handleReset={handleReset} />
        </ViewMainContainer>
      </form>
    </>
  );
};

export default UpsertTermsAndConditionForm;
