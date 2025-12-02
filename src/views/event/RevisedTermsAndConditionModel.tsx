'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import InputLabel from '@mui/material/InputLabel';
import CardContent from '@mui/material/CardContent';
import FormHelperText from '@mui/material/FormHelperText';
import { LoadingButton } from '@mui/lab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import DragAndDropSinglePDF from 'components/UIComponent/DragAndDropSinglePDF';
import { ViewMainContainer } from 'views/event/Event.styled';
import { revisedTermsAndConditionsSchema } from 'validations/validationSchemas';
import { TermsAndConditionServices } from 'services/parameter/termsAndCondition/termsAndCondition.services';
import { LoadingState } from 'types/table';
import {
  AddRevisedTermsAndConditionParams,
  RevisedTermsAndConditionData,
  TermsConditionUploadImagesParams,
} from 'services/parameter/termsAndCondition/type';
import CircularLoader from 'components/CircularLoader';
import CustomDialog from 'components/UIComponent/Dialogs/CustomDialog/CustomDialog';
import AnimateButton from 'components/@extended/AnimateButton';
import {
  TermsAndConditionFormContainer,
  TermsAndConditionDragPdf,
  RevisedTermsAndConditionmMainContainer,
  RevisedTermsAndConditionContainer,
} from 'views/parameter/TermsAndCondition/UpsertTermsAndCondition.styled';
import { RevisedTermsAndConditionModelProps } from 'types/dialog';

const RevisedTermsAndConditionModel = ({ open, handleClose, eventId }: RevisedTermsAndConditionModelProps) => {
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false });
  const [termAndConditionData, setTermsAndConditionData] = useState<RevisedTermsAndConditionData>();
  const [refresh, setRefresh] = useState(false);

  const initialValues = { termsConditionDoc: '' };

  const { errors, values, touched, handleSubmit, setFieldValue, isSubmitting, resetForm } = useFormik({
    initialValues,
    validationSchema: revisedTermsAndConditionsSchema,
    onSubmit: (values) => {
      // eslint-disable-next-line no-use-before-define
      return handleSubmitForm(values);
    },
  });

  const isURL = (text: string | undefined | null): boolean => {
    if (!text || typeof text !== 'string' || !text.startsWith('http')) return false;
    try {
      new URL(text);
      return true;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Invalid URL', e);
      return false;
    }
  };

  const handleAddTermsAndCondition = async (values: AddRevisedTermsAndConditionParams) => {
    const params = {
      eventId,
      fileName: values?.termsConditionDoc,
    };
    const res = await TermsAndConditionServices.rveisedTermsAndCondition(params);
    if (typeof res !== 'string' && res.success) {
      toast.success('Revised Term & condition added successfully');
      setRefresh((prev) => !prev);
    }
  };

  const handleSubmitForm = async (values: AddRevisedTermsAndConditionParams) => {
    if (typeof values.termsConditionDoc !== 'string') {
      const params: TermsConditionUploadImagesParams = {
        file: values.termsConditionDoc[0],
        oldFile: termAndConditionData?.TermsCondition || null,
      };

      const uploadKit = await TermsAndConditionServices.uploadImage(params);
      if (typeof uploadKit !== 'string') {
        values.termsConditionDoc = uploadKit.data;
        handleAddTermsAndCondition(values);
      }
    } else handleAddTermsAndCondition(values);
  };

  useEffect(() => {
    if (open && !isNaN(Number(eventId))) {
      const handleGetSellingById = async () => {
        setLoading((prev) => ({ ...prev, isProgress: true }));
        try {
          const res = await TermsAndConditionServices.getRevisedTermsConditions(eventId);
          if (typeof res !== 'string' && res.success) setTermsAndConditionData(res.data);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error in revised terms and condition:', error);
          toast.error('Failed to revised terms and condition.');
        } finally {
          setLoading((prev) => ({ ...prev, isProgress: false }));
        }
      };

      handleGetSellingById();
    }
  }, [open, eventId, refresh]);

  const handleDialogClose = () => {
    resetForm();
    setTermsAndConditionData(undefined);
    handleClose();
  };

  return (
    <CustomDialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="md"
      content={
        <>
          {loading.isProgress && <CircularLoader isProgress={loading.isProgress} />}
          <form onSubmit={handleSubmit}>
            <ViewMainContainer>
              <MainCard title="Revise Terms & Conditions" content={false}>
                <CardContent>
                  <RevisedTermsAndConditionmMainContainer>
                    <TermsAndConditionFormContainer>
                      <TermsAndConditionDragPdf>
                        <InputLabel>
                          Terms & Conditions <span style={{ color: 'red' }}>*</span>
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
                      <AnimateButton>
                        <LoadingButton loading={isSubmitting} type="submit" variant="contained">
                          <Box
                            component="img"
                            src="/assets/icons/save.png"
                            width={18}
                            height={18}
                            sx={{ mr: 1, filter: 'invert(1) brightness(2)' }}
                          />
                          Save
                        </LoadingButton>
                      </AnimateButton>
                    </TermsAndConditionFormContainer>
                    <RevisedTermsAndConditionContainer>
                      <Typography variant="body1">
                        {termAndConditionData?.TermsCondition && isURL(termAndConditionData?.TermsCondition) ? (
                          <iframe
                            src={termAndConditionData?.TermsCondition}
                            style={{ width: '100%', height: '500px', border: 'none' }}
                            title={`Terms and Conditions ${termAndConditionData?.SeqNo}`}
                            sandbox="Terms and conditions"
                          ></iframe>
                        ) : (
                          <Typography variant="body1">{termAndConditionData?.TermsCondition}</Typography>
                        )}
                      </Typography>
                    </RevisedTermsAndConditionContainer>
                  </RevisedTermsAndConditionmMainContainer>
                </CardContent>
              </MainCard>
            </ViewMainContainer>
          </form>
        </>
      }
    />
  );
};

export default RevisedTermsAndConditionModel;
