import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { StyledEllipsisText } from 'views/common.styled';
import { TableCellComponentProps, TableCellClickComponentProps, RenderTableCellProps, TableCellLinkComponentProps } from 'types/tableCell';

export const renderTableCell = ({
  content,
  defaultValue = '-',
  align = 'left',
  component = 'td',
  padding = 'normal',
  width,
  sx,
}: TableCellComponentProps) => (
  <TableCell component={component} align={align} padding={padding} width={width} sx={sx}>
    <Typography>{content !== null && content !== undefined && content !== '' ? content : defaultValue}</Typography>
  </TableCell>
);

export const renderStringOrHtmlCell = ({
  content,
  defaultValue = '-',
  align = 'left',
  component = 'td',
  padding = 'normal',
  width,
}: TableCellComponentProps) => {
  const isHTMLString = typeof content === 'string' && content.trim().startsWith('<') && content.trim().endsWith('>');

  return (
    <TableCell component={component} align={align} padding={padding} width={width}>
      {isHTMLString ? (
        <div dangerouslySetInnerHTML={{ __html: content as string }} />
      ) : (
        <Typography>{content !== null && content !== undefined && content !== '' ? content : defaultValue}</Typography>
      )}
    </TableCell>
  );
};

export const renderTableCellClick = ({
  content,
  defaultValue = '-',
  align = 'left',
  component = 'td',
  padding = 'normal',
  width,
  onClick,
}: TableCellClickComponentProps) => {
  const isValidContent = content !== null && content !== undefined && content !== '';

  return (
    <TableCell
      component={component}
      align={align}
      padding={padding}
      width={width}
      onClick={onClick}
      sx={{
        cursor: isValidContent ? 'pointer' : 'default',
        textDecoration: isValidContent ? 'underline' : 'none',
        color: isValidContent ? '#1976d2' : 'inherit',
      }}
    >
      <StyledEllipsisText>{isValidContent ? content : defaultValue}</StyledEllipsisText>
    </TableCell>
  );
};

export const renderTableCellLink = ({
  content,
  defaultValue = '-',
  align = 'left',
  component = 'td',
  padding = 'normal',
  width,
  redirectUrl,
}: TableCellLinkComponentProps) => {
  const isValidContent = content !== null && content !== undefined && content !== '';

  return (
    <TableCell
      component={component}
      align={align}
      padding={padding}
      width={width}
      sx={{
        cursor: isValidContent ? 'pointer' : 'default',
        textDecoration: isValidContent ? 'underline' : 'none',
        '& a': { color: isValidContent ? '#1976d2' : 'inherit' },
      }}
    >
      <Link href={redirectUrl || '#'}>
        <StyledEllipsisText>{isValidContent ? content : defaultValue}</StyledEllipsisText>
      </Link>
    </TableCell>
  );
};

export const renderTableCellEllipsis = ({
  content,
  defaultValue = '-',
  align = 'left',
  component = 'td',
  padding = 'normal',
  width,
}: TableCellComponentProps) => (
  <TableCell component={component} align={align} padding={padding} width={width}>
    <StyledEllipsisText>{content !== null && content !== undefined && content !== '' ? content : defaultValue}</StyledEllipsisText>
  </TableCell>
);

export const renderTableCellFixed = ({ content, format, defaultValue = '-', align = 'left', width, sx }: RenderTableCellProps) => {
  const displayContent = content !== null && content !== undefined && content !== '' ? (format ? format(content) : content) : defaultValue;

  return (
    <TableCell align={align} sx={sx} width={width}>
      {displayContent}
    </TableCell>
  );
};
