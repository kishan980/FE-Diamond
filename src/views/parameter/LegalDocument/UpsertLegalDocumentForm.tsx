'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import CardContent from '@mui/material/CardContent';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { UpsertDocumentDescMainContainer, UpsertDocumentDesContainer, UpsertEventTypeContainer } from './UpsertLegalDocument.styled';
import MainCard from 'components/MainCard';
import FormInput from 'components/UIComponent/FormInput';
import CardActionButtons from 'components/UIComponent/CardActionButton';
import UIRadioButtonsGroup from 'components/UIComponent/RadioButtonGroup';
import { MultipleOptions } from 'components/UIComponent/type';
import { ViewMainContainer } from 'views/event/Event.styled';
import { legalDocumentSchema } from 'validations/validationSchemas';
import { LegalDocumentServices } from 'services/parameter/legalDocument/legalDocument.services';
import { AddLegalDocumentParams, LegalDocumentByIdData } from 'services/parameter/legalDocument/type';
import { EventServices } from 'services/event/event.services';
import { ProductTypeData } from 'services/event/types';
import { extractFirstItemValue } from 'utils/extractFirstItemValue';
import CircularLoader from 'components/CircularLoader';
import { LoadingState } from 'types/table';
import Loader from 'components/Loader';

const UpsertLegalDocumentForm = () => {
  const { push } = useRouter();
  const { id } = useParams();
  const legalId = Number(id);

  const [legalDocDetails, setLegalDocDetails] = useState<LegalDocumentByIdData>();
  const [productTypes, setProductTypes] = useState<ProductTypeData[]>([]);
  const [productTypeOptions, setProductTypeOptions] = useState<MultipleOptions[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false });

  const initialValues = {
    title: '',
    eventCategoryId: productTypes?.length ? productTypes[0]?.eventcategoryID : 0,
    docDescription: '',
    terminal: '',
  };

  const {
    errors,
    values,
    touched,
    handleChange,
    handleBlur,
    setValues,
    resetForm,
    setSubmitting,
    handleSubmit,
    setFieldValue,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema: legalDocumentSchema,
    onSubmit: (values) => {
      // eslint-disable-next-line no-use-before-define
      return handleSubmitForm(values);
    },
  });

  const handleResetForm = () => {
    resetForm();
    setValues({
      title: '',
      eventCategoryId: productTypes?.length ? productTypes[0]?.eventcategoryID : 0,
      docDescription: '',
      terminal: '',
    });
  };

  const handleEventTypeChange = (value: string) => setFieldValue('eventCategoryId', value);

  const handleSubmitForm = async (values: AddLegalDocumentParams) => {
    try {
      const res = legalId
        ? await LegalDocumentServices.updateLegalDocument({ ...values, id: legalId })
        : await LegalDocumentServices.addLegalDocument(values);

      if (typeof res !== 'string' && res.success) {
        push('/master-setup/legal-document');
        toast.success('Legal document ' + (legalId ? 'updated' : 'added') + ' successfully');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while saving the legal document', error);
      toast.error('An error occurred while saving the legal document');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchLegalDocumentDetails = async (id: number) => {
    setLoading((prev) => ({ ...prev, isProgress: true }));
    try {
      const res = await LegalDocumentServices.getLegalDocumentById(id);
      if (typeof res !== 'string' && res.success) setLegalDocDetails(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching legal document details:', error);
      toast.error('Error fetching legal document details.');
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: false }));
    }
  };

  const fetchProductTypeData = async () => {
    setLoading((prev) => ({ ...prev, isProgress: true }));

    try {
      const response = await EventServices.getProductType();

      if (typeof response !== 'string' && response) {
        setProductTypes(response.data);

        const options = response.data.map((type) => ({
          id: type.eventcategoryID,
          name: type.eventcategory,
        }));
        setProductTypeOptions(options);
        setValues({
          ...values,
          eventCategoryId: extractFirstItemValue(response, 'eventcategoryID', 0),
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching fetchProductTypeData:', error);
      toast.error('Error fetching fetchProductTypeData.');
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: false }));
    }
  };

  useEffect(() => {
    fetchProductTypeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (legalId) fetchLegalDocumentDetails(legalId);
  }, [legalId]);

  useEffect(() => {
    if (legalId)
      setValues({
        ...values,
        title: legalDocDetails?.DocTitle || '',
        eventCategoryId:
          legalDocDetails?.refEventCategoryID_EventCategoryMas ?? (productTypes.length > 0 ? productTypes[0].eventcategoryID : 0),
        docDescription: legalDocDetails?.docDescription || '',
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legalDocDetails]);

  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <>
      {(loading.isProgress || loading.isLoading) && <CircularLoader isProgress={loading.isProgress || loading.isLoading} />}
      <form onSubmit={handleSubmit}>
        <ViewMainContainer>
          <MainCard title={`${legalId ? 'Update' : 'Add'} Legal Document`} content={false}>
            <CardContent>
              <UpsertDocumentDescMainContainer>
                <UpsertDocumentDesContainer>
                  <FormInput
                    id="title"
                    name="title"
                    label="Document title"
                    required
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title ? errors.title : undefined}
                  />
                  <UpsertEventTypeContainer>
                    <InputLabel>
                      Event type <span style={{ color: 'red' }}>*</span>
                    </InputLabel>
                    <UIRadioButtonsGroup
                      options={productTypeOptions}
                      defaultValue={values.eventCategoryId}
                      onChange={handleEventTypeChange}
                      disabled={false}
                    />
                    {errors.eventCategoryId && touched.eventCategoryId && (
                      <FormHelperText error id="standard-weight-helper-text-email-login">
                        {errors.eventCategoryId}
                      </FormHelperText>
                    )}
                  </UpsertEventTypeContainer>
                  <FormInput
                    id="docDescription"
                    name="docDescription"
                    label="Document Description"
                    required
                    multiline
                    rows={4}
                    value={values.docDescription}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.docDescription && Boolean(errors.docDescription)}
                    helperText={touched.docDescription ? errors.docDescription : undefined}
                  />
                </UpsertDocumentDesContainer>
              </UpsertDocumentDescMainContainer>
            </CardContent>
          </MainCard>
          <CardActionButtons isSubmitting={isSubmitting} id={legalId} handleReset={handleResetForm} />
        </ViewMainContainer>
      </form>
    </>
  );
};

export default UpsertLegalDocumentForm;
