import { forwardRef, CSSProperties, ReactElement, Ref } from 'react';
import { CardProps } from '@mui/material/Card';
import CardContent, { CardContentProps } from '@mui/material/CardContent';
import CardHeader, { CardHeaderProps } from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MainCardStyled from './MainCardStyled';
import { KeyedObject } from 'types/root';

const headerSX = {
  px: 2.5,
  py: 1,
  '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' },
};

export interface MainCardProps extends KeyedObject {
  border?: boolean;
  boxShadow?: boolean;
  children?: ReactElement | string;
  subheader?: ReactElement | string;
  style?: CSSProperties;
  content?: boolean;
  contentSX?: CardContentProps['sx'];
  darkTitle?: boolean;
  divider?: boolean;
  sx?: CardProps['sx'];
  secondary?: CardHeaderProps['action'];
  shadow?: string;
  elevation?: number;
  title?: ReactElement | string;
  codeHighlight?: boolean;
  modal?: boolean;
  headerClassName?: string;
}

const MainCard = forwardRef(
  (
    {
      border = true,
      boxShadow = true,
      children,
      subheader,
      content = true,
      contentSX = {},
      darkTitle,
      divider = true,
      elevation,
      secondary,
      shadow,
      sx = {},
      title,
      codeHighlight = false,
      modal = false,
      headerClassName,
      ...others
    }: MainCardProps,
    ref: Ref<HTMLDivElement>
  ) => {
    return (
      <MainCardStyled {...{ border, shadow, boxShadow, codeHighlight, modal, sx, elevation: elevation || 0, ...others }} ref={ref}>
        {!darkTitle && title && (
          <CardHeader
            sx={headerSX}
            titleTypographyProps={{ variant: 'subtitle1' }}
            title={title}
            action={secondary}
            subheader={subheader}
            className={headerClassName ? headerClassName : ''}
          />
        )}
        {darkTitle && title && <CardHeader sx={headerSX} title={<Typography variant="h4">{title}</Typography>} action={secondary} />}
        {title && divider && <Divider />}
        {content && <CardContent sx={contentSX}>{children}</CardContent>}
        {!content && children}
      </MainCardStyled>
    );
  }
);

export default MainCard;
