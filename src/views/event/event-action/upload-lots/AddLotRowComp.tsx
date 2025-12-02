import React, { ChangeEvent, FocusEvent, KeyboardEvent, memo, RefObject } from 'react';
import { FormikErrors, FormikTouched } from 'formik';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import CameraIconButton from 'components/UIComponent/IconButtons/CameraButton';
import CameraSlashIconButton from 'components/UIComponent/IconButtons/CameraSlashButton';
import FolderIconButton from 'components/UIComponent/IconButtons/FolderButton';
import InputText from 'components/UIComponent/InputText';
import { StyledSelect } from 'components/UIComponent/ThemeCSS/StyleSelect';
import { UploadLotsData } from 'services/event/event-action/upload-lots/type';
import { StickyColCell } from 'views/common.styled';
import { EventOrganizedForData, MinesData } from 'services/event/types';
import { handleMultipleKeyNavigation, setInputRef } from 'utils/inputNavigation';

const AddLotRowComp = ({
  inputRefs,
  eventCategoryID,
  values,
  handleClick,
  touched,
  handleChange,
  handleBlur,
  errors,
  handleClickSingleFileButton,
  handleRateBlurDecimal,
  handleCtsBlurDecimal,
  handleClickMoreMenuButton,
  sellerData,
  mineData,
  labelId,
  isItemSelected,
  dataIndex,
  rowRef,
  setFieldValue,
}: {
  dataIndex: number;
  inputRefs: React.MutableRefObject<Array<[HTMLInputElement | null, HTMLInputElement | null]>>;
  eventCategoryID: number;
  values: UploadLotsData;
  handleClick: (id: number) => void;
  touched: FormikTouched<{
    Master: UploadLotsData[];
  }>;
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T_1 = string | ChangeEvent<any>>(field: T_1): T_1 extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
  };
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  errors: FormikErrors<{
    Master: UploadLotsData[];
  }>;
  handleClickSingleFileButton: (LotNo: string) => void;
  handleClickMoreMenuButton: (LotNo: string) => void;
  sellerData: EventOrganizedForData[];
  labelId: string;
  isItemSelected: boolean;
  mineData: MinesData[];
  rowRef?: RefObject<HTMLTableRowElement>;
  handleRateBlurDecimal: (dataIndex: number, name: string) => void;
  handleCtsBlurDecimal: (dataIndex: number, name: string) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}) => {
  const handleNumericChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/^0+|[^0-9]/g, '');
    setFieldValue(name, numericValue === '' ? 0 : parseInt(numericValue, 10), false);
  };

  const handleDecimalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9.]/g, '');
    setFieldValue(name, numericValue, false);
  };

  const handleDecimalFocus = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '0' || value === '0.00') {
      setFieldValue(name, '', false);
    }
  };
  return (
    <TableRow
      hover
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      selected={isItemSelected}
      sx={{ verticalAlign: 'top' }}
      ref={rowRef}
      className="hover-row"
    >
      <TableCell>
        <Checkbox
          color="primary"
          checked={isItemSelected}
          onClick={() => handleClick(dataIndex)}
          inputProps={{ 'aria-labelledby': labelId }}
          sx={{ padding: '5px' }}
        />
      </TableCell>
      <TableCell>
        <InputText
          type="text"
          fullWidth
          id={`Master[${dataIndex}].stockNo`}
          name={`Master[${dataIndex}].stockNo`}
          onChange={handleChange}
          value={values.stockNo}
          inputRef={(el) => setInputRef(inputRefs.current, dataIndex, 0, el)}
          onBlur={handleBlur}
          onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, dataIndex, 0)}
          error={touched.Master?.[dataIndex]?.stockNo && Boolean((errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.stockNo)}
          helperText={touched.Master?.[dataIndex]?.stockNo && (errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.stockNo}
          sx={{ minWidth: '80px' }}
        />
      </TableCell>
      {eventCategoryID === 1 && (
        <>
          <TableCell>
            <InputText
              type="text"
              size="small"
              id={`Master[${dataIndex}].Size`}
              fullWidth
              name={`Master[${dataIndex}].Size`}
              value={values.Size}
              onChange={handleChange}
              inputRef={(el) => setInputRef(inputRefs.current, dataIndex, 1, el)}
              onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, dataIndex, 1)}
              onBlur={handleBlur}
              error={touched.Master?.[dataIndex]?.Size && Boolean((errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.Size)}
              helperText={touched.Master?.[dataIndex]?.Size && (errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.Size}
              sx={{ minWidth: '80px' }}
            />
          </TableCell>
          <TableCell>
            <InputText
              type="text"
              id={`Master[${dataIndex}].stockDesc`}
              size="small"
              fullWidth
              name={`Master[${dataIndex}].stockDesc`}
              value={values.stockDesc}
              onChange={handleChange}
              inputRef={(el) => setInputRef(inputRefs.current, dataIndex, 2, el)}
              onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, dataIndex, 2)}
              onBlur={handleBlur}
              error={
                touched.Master?.[dataIndex]?.stockDesc && Boolean((errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.stockDesc)
              }
              helperText={touched.Master?.[dataIndex]?.stockDesc && (errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.stockDesc}
              sx={{ minWidth: '130px' }}
            />
          </TableCell>
          <TableCell>
            <StyledSelect
              id={`Master[${dataIndex}].SellerID`}
              name={`Master[${dataIndex}].SellerID`}
              value={values.SellerID}
              inputRef={(el) => setInputRef(inputRefs.current, dataIndex, 3, el)}
              onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, dataIndex, 3)}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.Master?.[dataIndex]?.SellerID && Boolean((errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.SellerID)
              }
            >
              {sellerData.map((item, idx) => (
                <MenuItem key={idx} value={item.sellerId}>
                  {item.sellerName}
                </MenuItem>
              ))}
            </StyledSelect>
          </TableCell>
          <TableCell>
            {mineData.length && (
              <StyledSelect
                id={`Master[${dataIndex}].MineID`}
                name={`Master[${dataIndex}].MineID`}
                value={values.MineID}
                inputRef={(el) => setInputRef(inputRefs.current, dataIndex, 4, el)}
                onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, dataIndex, 4)}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.Master?.[dataIndex]?.MineID && Boolean((errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.MineID)}
              >
                {mineData.map((item, idx) => (
                  <MenuItem key={idx} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </StyledSelect>
            )}
          </TableCell>
        </>
      )}
      {eventCategoryID === 2 && (
        <>
          <TableCell>
            <InputText
              type="text"
              size="small"
              id={`Master[${dataIndex}].Shape`}
              fullWidth
              name={`Master[${dataIndex}].Shape`}
              value={values.Shape}
              inputRef={(el) => setInputRef(inputRefs.current, dataIndex, 1, el)}
              onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, dataIndex, 1)}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.Master?.[dataIndex]?.Shape && Boolean((errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.Shape)}
              helperText={touched.Master?.[dataIndex]?.Shape && (errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.Shape}
              sx={{ minWidth: '80px' }}
            />
          </TableCell>
          <TableCell>
            <InputText
              type="text"
              size="small"
              id={`Master[${dataIndex}].cts`}
              fullWidth
              name={`Master[${dataIndex}].cts`}
              inputProps={{ inputMode: 'decimal' }}
              value={values.cts}
              inputRef={(el) => setInputRef(inputRefs.current, dataIndex, 2, el)}
              onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, dataIndex, 2)}
              onChange={handleDecimalChange}
              onBlur={() => handleCtsBlurDecimal(dataIndex, 'cts')}
              onFocus={handleDecimalFocus}
              error={touched.Master?.[dataIndex]?.cts && Boolean((errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.cts)}
              helperText={touched.Master?.[dataIndex]?.cts && (errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.cts}
              sx={{ minWidth: '80px' }}
            />
          </TableCell>
          <TableCell>
            <InputText
              type="text"
              size="small"
              fullWidth
              id={`Master[${dataIndex}].Colour`}
              name={`Master[${dataIndex}].Colour`}
              value={values.Colour}
              inputRef={(el) => setInputRef(inputRefs.current, dataIndex, 3, el)}
              onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, dataIndex, 3)}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.Master?.[dataIndex]?.Colour && Boolean((errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.Colour)}
              helperText={touched.Master?.[dataIndex]?.Colour && (errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.Colour}
              sx={{ minWidth: '80px' }}
            />
          </TableCell>
          <TableCell>
            <InputText
              type="text"
              size="small"
              fullWidth
              id={`Master[${dataIndex}].Clarity`}
              name={`Master[${dataIndex}].Clarity`}
              value={values.Clarity}
              inputRef={(el) => setInputRef(inputRefs.current, dataIndex, 4, el)}
              onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, dataIndex, 4)}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.Master?.[dataIndex]?.Clarity && Boolean((errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.Clarity)}
              helperText={touched.Master?.[dataIndex]?.Clarity && (errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.Clarity}
              sx={{ minWidth: '80px' }}
            />
          </TableCell>
          <TableCell>
            <InputText
              type="text"
              size="small"
              fullWidth
              id={`Master[${dataIndex}].Cut`}
              name={`Master[${dataIndex}].Cut`}
              value={values.Cut}
              inputRef={(el) => setInputRef(inputRefs.current, dataIndex, 5, el)}
              onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, dataIndex, 5)}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.Master?.[dataIndex]?.Cut && Boolean((errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.Cut)}
              helperText={touched.Master?.[dataIndex]?.Cut && (errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.Cut}
              sx={{ minWidth: '80px' }}
            />
          </TableCell>
        </>
      )}
      <TableCell>
        <InputText
          type="text"
          size="small"
          fullWidth
          id={`Master[${dataIndex}].pcs`}
          name={`Master[${dataIndex}].pcs`}
          value={values.pcs}
          inputProps={{ inputMode: 'decimal' }}
          inputRef={(el) => setInputRef(inputRefs.current, dataIndex, eventCategoryID === 2 ? 6 : 5, el)}
          onKeyDown={(e) =>
            handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, dataIndex, eventCategoryID === 2 ? 6 : 5)
          }
          onChange={handleNumericChange}
          onBlur={handleBlur}
          error={touched.Master?.[dataIndex]?.pcs && Boolean((errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.pcs)}
          helperText={touched.Master?.[dataIndex]?.pcs && (errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.pcs}
          sx={{ minWidth: '80px' }}
        />
      </TableCell>
      {eventCategoryID === 2 && (
        <TableCell>
          <InputText
            type="text"
            size="small"
            fullWidth
            id={`Master[${dataIndex}].Comment`}
            name={`Master[${dataIndex}].Comment`}
            value={values.Comment}
            inputRef={(el) => setInputRef(inputRefs.current, dataIndex, 7, el)}
            onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, dataIndex, 7)}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.Master?.[dataIndex]?.Comment && Boolean((errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.Comment)}
            helperText={touched.Master?.[dataIndex]?.Comment && (errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.Comment}
            sx={{ minWidth: '100px' }}
          />
        </TableCell>
      )}
      {eventCategoryID === 1 && (
        <TableCell>
          <InputText
            type="text"
            size="small"
            fullWidth
            id={`Master[${dataIndex}].cts`}
            name={`Master[${dataIndex}].cts`}
            inputProps={{ inputMode: 'decimal' }}
            value={values.cts}
            inputRef={(el) => setInputRef(inputRefs.current, dataIndex, 6, el)}
            onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, dataIndex, 6)}
            onChange={handleDecimalChange}
            onBlur={() => handleCtsBlurDecimal(dataIndex, 'cts')}
            onFocus={handleDecimalFocus}
            error={touched.Master?.[dataIndex]?.cts && Boolean((errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.cts)}
            helperText={touched.Master?.[dataIndex]?.cts && (errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.cts}
            sx={{ minWidth: '80px' }}
          />
        </TableCell>
      )}
      <TableCell>
        <InputText
          type="text"
          size="small"
          fullWidth
          id={`Master[${dataIndex}].rate`}
          name={`Master[${dataIndex}].rate`}
          inputProps={{ inputMode: 'decimal' }}
          value={values.rate}
          inputRef={(el) => setInputRef(inputRefs.current, dataIndex, eventCategoryID === 2 ? 8 : 7, el)}
          onKeyDown={(e) =>
            handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, dataIndex, eventCategoryID === 2 ? 8 : 7)
          }
          onChange={handleDecimalChange}
          onFocus={handleDecimalFocus}
          onBlur={() => handleRateBlurDecimal(dataIndex, 'rate')}
          error={touched.Master?.[dataIndex]?.rate && Boolean((errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.rate)}
          helperText={touched.Master?.[dataIndex]?.rate && (errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.rate}
          sx={{ minWidth: '80px' }}
        />
      </TableCell>
      <TableCell>
        <StyledSelect
          id={`Master[${dataIndex}].refEventTypeID_EventTypeMas`}
          name={`Master[${dataIndex}].refEventTypeID_EventTypeMas`}
          value={values.refEventTypeID_EventTypeMas}
          inputRef={(el) => setInputRef(inputRefs.current, dataIndex, eventCategoryID === 2 ? 9 : 8, el)}
          onKeyDown={(e) =>
            handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, dataIndex, eventCategoryID === 2 ? 9 : 8)
          }
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            touched.Master?.[dataIndex]?.refEventTypeID_EventTypeMas &&
            Boolean((errors.Master?.[dataIndex] as FormikErrors<UploadLotsData>)?.MineID)
          }
          sx={{ width: '100%', minWidth: '172px' }}
        >
          <MenuItem value="1">Tender</MenuItem>
          <MenuItem value="2">Auction</MenuItem>
        </StyledSelect>
      </TableCell>
      <StickyColCell width="1%" fixRight={0} fixWidth={150}>
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
          {(values as UploadLotsData).isLotExist && (
            <IconButton onClick={() => handleClickMoreMenuButton((values as UploadLotsData).stockNo)}>
              {(values as UploadLotsData).isImageExist ? (
                <CameraIconButton title="Upload Lot Image/Video" />
              ) : (
                <CameraSlashIconButton title="Upload Lot Image/Video" />
              )}
            </IconButton>
          )}
          {eventCategoryID === 2 && (
            <FolderIconButton title="Upload Stock Detail" onClick={() => handleClickSingleFileButton((values as UploadLotsData).stockNo)} />
          )}
        </Box>
      </StickyColCell>
    </TableRow>
  );
};

export default memo(AddLotRowComp);
