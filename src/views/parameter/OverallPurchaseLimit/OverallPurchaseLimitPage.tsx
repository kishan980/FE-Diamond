'use client';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import { EditorState } from 'draft-js';
import { EditorProps } from 'react-draft-wysiwyg';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import dynamic from 'next/dynamic';
import { MoneyChange } from 'iconsax-react';
import { UIStyledGrid } from './OverallPurchaseLimit.styled';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import CircularLoader from 'components/UIComponent/CircularLoader';
import { ViewMainContainer } from 'views/event/Event.styled';
import { StyledActionButtonGroup, UpsertTitle } from 'views/common.styled';
import useConfig from 'hooks/useConfig';
import { LoadingState } from 'types/table';
import { OverallPurchaseLimitServices } from 'services/parameter/overallPurchaseLimit/overallPurchaseLimit.services';
import { UpdateOverallPurchaseLimitParams } from 'services/parameter/overallPurchaseLimit/type';

const Editor = dynamic<EditorProps>(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), { ssr: false });

const OverallPurchaseLimitPage = () => {
  const [editorStateUpperText, setEditorStateUpperText] = useState(EditorState.createEmpty());
  const [editorStateExplanationText, setEditorStateExplanationText] = useState(EditorState.createEmpty());
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false });
  const [isTextModified, setIsTextModified] = useState(false);
  const [originalValues, setOriginalValues] = useState({ upperText: '', explanationText: '' });

  const { themeDirection } = useConfig();

  const initialValues = { upperText: '', explanationText: '' };

  const { setValues, handleSubmit, setFieldValue, isSubmitting, setSubmitting, values } = useFormik({
    initialValues,
    onSubmit: async () => {
      // eslint-disable-next-line no-use-before-define
      return await handleSubmitForm();
    },
  });

  const htmlToEditorState = (html: string) => {
    const contentState = stateFromHTML(html);
    return EditorState.createWithContent(contentState);
  };

  const editorStateToHtml = (editorState: EditorState) => {
    return stateToHTML(editorState.getCurrentContent());
  };

  const fetchData = async () => {
    setLoading((prev) => ({ ...prev, isProgress: true }));
    try {
      const res = await OverallPurchaseLimitServices.overallPurchaseLimitData();
      if (typeof res !== 'string' && (res as any).success) {
        const { upperText, explanationText } = (res as any).data;

        setEditorStateUpperText(htmlToEditorState(upperText));
        setEditorStateExplanationText(htmlToEditorState(explanationText));

        setOriginalValues({ upperText, explanationText });
        setValues({ upperText, explanationText });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching overall purchase limit data:', error);
      toast.error('Failed to fetch overall purchase limit data.');
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: false }));
    }
  };

  const handleSubmitForm = async () => {
    setLoading((prev) => ({ ...prev, isProgress: true }));
    try {
      const params: UpdateOverallPurchaseLimitParams = {
        upperText: editorStateToHtml(editorStateUpperText),
        explanationText: editorStateToHtml(editorStateExplanationText),
      };

      const res = await OverallPurchaseLimitServices.updateOverallPurchaseLimit(params);
      if (typeof res !== 'string' && res.success) {
        toast.success('Purchase limit updated successfully');
        fetchData();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating Purchase Limit:', error);
      toast.error('Failed to update Purchase Limit.');
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: false }));
      setSubmitting(false);
    }
  };

  const checkIfModified = (newValues: typeof initialValues) => {
    return newValues.upperText !== originalValues.upperText || newValues.explanationText !== originalValues.explanationText;
  };

  const onEditorStateChangeUpperText = (editorState: EditorState) => {
    setEditorStateUpperText(editorState);
    setFieldValue('upperText', editorStateToHtml(editorState));

    const modified = checkIfModified({ ...values, upperText: editorStateToHtml(editorState) });
    setIsTextModified(modified);
  };

  const onEditorStateChangeExplanationText = (editorState: EditorState) => {
    setEditorStateExplanationText(editorState);
    setFieldValue('explanationText', editorStateToHtml(editorState));

    const modified = checkIfModified({ ...values, explanationText: editorStateToHtml(editorState) });
    setIsTextModified(modified);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showLoader = useMemo(() => loading.isLoading && !loading.isProgress, [loading.isLoading, loading.isProgress]);

  if (showLoader) return <Loader />;

  return (
    <>
      {(loading.isProgress || loading.isLoading) && <CircularLoader isProgress={loading.isProgress || loading.isLoading} />}
      <form onSubmit={handleSubmit}>
        <ViewMainContainer>
          <UpsertTitle>
            <Typography variant="h4">Purchase Limit</Typography>
          </UpsertTitle>
          <Grid container>
            <UIStyledGrid themeDirection={themeDirection} item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <MainCard title="Upper Text" sx={{ overflow: 'visible' }}>
                  <Editor editorState={editorStateUpperText} onEditorStateChange={onEditorStateChangeUpperText} />
                </MainCard>
                <MainCard title="Explanation Text" sx={{ overflow: 'visible' }}>
                  <Editor editorState={editorStateExplanationText} onEditorStateChange={onEditorStateChangeExplanationText} />
                </MainCard>
                <CardActions>
                  <StyledActionButtonGroup direction="row">
                    <AnimateButton>
                      <Button
                        disableElevation
                        disabled={!isTextModified || isSubmitting}
                        variant="contained"
                        type="submit"
                        startIcon={<MoneyChange color="#d9e3f0" />}
                      >
                        Update Purchase Limit Page
                      </Button>
                    </AnimateButton>
                  </StyledActionButtonGroup>
                </CardActions>
              </Box>
            </UIStyledGrid>
          </Grid>
        </ViewMainContainer>
      </form>
    </>
  );
};

export default OverallPurchaseLimitPage;
