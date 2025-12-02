import { FormikErrors, FormikTouched } from 'formik';
import React, { ChangeEvent, FocusEvent, KeyboardEvent, memo, RefObject } from 'react';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import InputText from 'components/UIComponent/InputText';
import { StyledSelect } from 'components/UIComponent/ThemeCSS/StyleSelect';
import { UploadAdditionalLotsData } from 'services/event/event-action/upload-lots/type';
import { EventOrganizedForData, MinesData } from 'services/event/types';
import { handleMultipleKeyNavigation, setInputRef } from 'utils/inputNavigation';

const UploadAdditionalLotsRowComp = ({
  isItemSelected,
  index,
  handleClick,
  handleChange,
  labelId,
  values,
  errors,
  touched,
  eventCategoryID,
  handleBlur,
  sellerData,
  mineData,
  inputRefs,
  rowRef,
  handleRateBlurDecimal,
  handleCtsBlurDecimal,
  setFieldValue,
}: {
  inputRefs: React.MutableRefObject<Array<[HTMLInputElement | null, HTMLInputElement | null]>>;
  eventCategoryID: number;
  values: UploadAdditionalLotsData;
  errors: FormikErrors<{
    Master: UploadAdditionalLotsData[];
  }>;
  touched: FormikTouched<{
    Master: UploadAdditionalLotsData[];
  }>;
  labelId: string;
  isItemSelected: boolean;
  index: number;
  handleClick: (id: number) => void;
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T_1 = string | ChangeEvent<any>>(field: T_1): T_1 extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
  };
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  sellerData: EventOrganizedForData[];
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
    >
      <TableCell>
        <Checkbox
          color="primary"
          checked={isItemSelected}
          onClick={() => handleClick(index)}
          inputProps={{ 'aria-labelledby': labelId }}
          sx={{ padding: '5px' }}
        />
      </TableCell>

      <TableCell>
        <InputText
          type="text"
          fullWidth
          id={`Master[${index}].stockNo`}
          name={`Master[${index}].stockNo`}
          value={values.stockNo}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.Master?.[index]?.stockNo && Boolean((errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.stockNo)}
          helperText={touched.Master?.[index]?.stockNo && (errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.stockNo}
          sx={{ minWidth: '80px' }}
          onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, index, 0)}
          inputRef={(el) => setInputRef(inputRefs.current, index, 0, el)}
        />
      </TableCell>

      {eventCategoryID === 1 && (
        <>
          <TableCell>
            <InputText
              type="text"
              size="small"
              fullWidth
              id={`Master[${index}].Size`}
              name={`Master[${index}].Size`}
              value={values.Size}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.Master?.[index]?.Size && Boolean((errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.Size)}
              helperText={touched.Master?.[index]?.Size && (errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.Size}
              sx={{ minWidth: '80px' }}
              onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, index, 1)}
              inputRef={(el) => setInputRef(inputRefs.current, index, 1, el)}
            />
          </TableCell>

          <TableCell>
            <InputText
              type="text"
              size="small"
              fullWidth
              id={`Master[${index}].stockDesc`}
              name={`Master[${index}].stockDesc`}
              value={values.stockDesc}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, index, 2)}
              inputRef={(el) => setInputRef(inputRefs.current, index, 2, el)}
              error={
                touched.Master?.[index]?.stockDesc && Boolean((errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.stockDesc)
              }
              helperText={
                touched.Master?.[index]?.stockDesc && (errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.stockDesc
              }
              sx={{ minWidth: '130px' }}
            />
          </TableCell>

          <TableCell>
            <StyledSelect
              id={`Master[${index}].SellerID`}
              name={`Master[${index}].SellerID`}
              value={values.SellerID}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, index, 3)}
              inputRef={(el) => setInputRef(inputRefs.current, index, 3, el)}
              error={
                touched.Master?.[index]?.SellerID && Boolean((errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.SellerID)
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
                id={`Master[${index}].MineID`}
                name={`Master[${index}].MineID`}
                value={values.MineID}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, index, 4)}
                inputRef={(el) => setInputRef(inputRefs.current, index, 4, el)}
                error={
                  touched.Master?.[index]?.MineID && Boolean((errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.MineID)
                }
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
              fullWidth
              id={`Master[${index}].Shape`}
              name={`Master[${index}].Shape`}
              value={values.Shape}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, index, 1)}
              inputRef={(el) => setInputRef(inputRefs.current, index, 1, el)}
              error={touched.Master?.[index]?.Shape && Boolean((errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.Shape)}
              helperText={touched.Master?.[index]?.Shape && (errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.Shape}
              sx={{ minWidth: '80px' }}
            />
          </TableCell>

          <TableCell>
            <InputText
              type="text"
              size="small"
              name={`Master[${index}].cts`}
              fullWidth
              inputProps={{ inputMode: 'decimal' }}
              value={values.cts}
              onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, index, 2)}
              inputRef={(el) => setInputRef(inputRefs.current, index, 2, el)}
              onChange={handleDecimalChange}
              onBlur={() => handleCtsBlurDecimal(index, 'cts')}
              onFocus={handleDecimalFocus}
              error={touched.Master?.[index]?.cts && Boolean((errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.cts)}
              helperText={touched.Master?.[index]?.cts && (errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.cts}
              sx={{ minWidth: '80px' }}
            />
          </TableCell>

          <TableCell>
            <InputText
              type="text"
              size="small"
              fullWidth
              id={`Master[${index}].Colour`}
              name={`Master[${index}].Colour`}
              value={values.Colour}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, index, 3)}
              inputRef={(el) => setInputRef(inputRefs.current, index, 3, el)}
              error={touched.Master?.[index]?.Colour && Boolean((errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.Colour)}
              helperText={touched.Master?.[index]?.Colour && (errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.Colour}
              sx={{ minWidth: '80px' }}
            />
          </TableCell>

          <TableCell>
            <InputText
              type="text"
              size="small"
              fullWidth
              id={`Master[${index}].Clarity`}
              name={`Master[${index}].Clarity`}
              value={values.Clarity}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, index, 4)}
              inputRef={(el) => setInputRef(inputRefs.current, index, 4, el)}
              error={
                touched.Master?.[index]?.Clarity && Boolean((errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.Clarity)
              }
              helperText={touched.Master?.[index]?.Clarity && (errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.Clarity}
              sx={{ minWidth: '80px' }}
            />
          </TableCell>

          <TableCell>
            <InputText
              type="text"
              size="small"
              fullWidth
              id={`Master[${index}].Cut`}
              name={`Master[${index}].Cut`}
              value={values.Cut}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, index, 5)}
              error={touched.Master?.[index]?.Cut && Boolean((errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.Cut)}
              helperText={touched.Master?.[index]?.Cut && (errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.Cut}
              inputRef={(el) => setInputRef(inputRefs.current, index, 5, el)}
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
          id={`Master[${index}].pcs`}
          name={`Master[${index}].pcs`}
          value={values.pcs}
          inputProps={{ inputMode: 'decimal' }}
          inputRef={(el) => setInputRef(inputRefs.current, index, eventCategoryID === 1 ? 5 : 6, el)}
          onKeyDown={(e) =>
            handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, index, eventCategoryID === 1 ? 5 : 6)
          }
          onChange={handleNumericChange}
          onBlur={handleBlur}
          error={touched.Master?.[index]?.pcs && Boolean((errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.pcs)}
          helperText={touched.Master?.[index]?.pcs && (errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.pcs}
          sx={{ minWidth: '80px' }}
        />
      </TableCell>

      {eventCategoryID === 2 && (
        <TableCell>
          <InputText
            type="text"
            size="small"
            fullWidth
            id={`Master[${index}].Comment`}
            name={`Master[${index}].Comment`}
            value={values.Comment}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.Master?.[index]?.Comment && Boolean((errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.Comment)}
            helperText={touched.Master?.[index]?.Comment && (errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.Comment}
            sx={{ minWidth: '100px' }}
            onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, index, 7)}
            inputRef={(el) => setInputRef(inputRefs.current, index, 7, el)}
          />
        </TableCell>
      )}

      {eventCategoryID === 1 && (
        <TableCell>
          <InputText
            type="text"
            size="small"
            fullWidth
            id={`Master[${index}].cts`}
            name={`Master[${index}].cts`}
            inputProps={{ inputMode: 'decimal' }}
            value={values.cts}
            inputRef={(el) => setInputRef(inputRefs.current, index, 6, el)}
            onKeyDown={(e) => handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, index, 6)}
            onChange={handleDecimalChange}
            onBlur={() => handleCtsBlurDecimal(index, 'cts')}
            onFocus={handleDecimalFocus}
            error={touched.Master?.[index]?.cts && Boolean((errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.cts)}
            helperText={touched.Master?.[index]?.cts && (errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.cts}
            sx={{ minWidth: '80px' }}
          />
        </TableCell>
      )}

      <TableCell>
        <InputText
          type="text"
          size="small"
          fullWidth
          id={`Master[${index}].rate`}
          name={`Master[${index}].rate`}
          inputProps={{ inputMode: 'decimal' }}
          value={values.rate}
          inputRef={(el) => setInputRef(inputRefs.current, index, eventCategoryID === 1 ? 7 : 8, el)}
          onKeyDown={(e) =>
            handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, index, eventCategoryID === 1 ? 7 : 8)
          }
          onChange={handleDecimalChange}
          onFocus={handleDecimalFocus}
          onBlur={() => handleRateBlurDecimal(index, 'rate')}
          error={touched.Master?.[index]?.rate && Boolean((errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.rate)}
          helperText={touched.Master?.[index]?.rate && (errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.rate}
          sx={{ minWidth: '80px' }}
        />
      </TableCell>

      <TableCell>
        <StyledSelect
          id={`Master[${index}].refEventTypeID_EventTypeMas`}
          name={`Master[${index}].refEventTypeID_EventTypeMas`}
          value={values.refEventTypeID_EventTypeMas}
          inputRef={(el) => setInputRef(inputRefs.current, index, eventCategoryID === 1 ? 8 : 9, el)}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            touched.Master?.[index]?.refEventTypeID_EventTypeMas &&
            Boolean((errors.Master?.[index] as FormikErrors<UploadAdditionalLotsData>)?.refEventTypeID_EventTypeMas)
          }
          sx={{ width: '100%', minWidth: '172px' }}
          onKeyDown={(e) =>
            handleMultipleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, index, eventCategoryID === 1 ? 8 : 9)
          }
        >
          <MenuItem value="1">Tender</MenuItem>
          <MenuItem value="2">Auction</MenuItem>
        </StyledSelect>
      </TableCell>
    </TableRow>
  );
};

export default memo(UploadAdditionalLotsRowComp);
