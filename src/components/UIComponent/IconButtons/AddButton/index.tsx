import Link from 'next/link';
import Tooltip from '@mui/material/Tooltip';
import { AddSquare } from 'iconsax-react';

const AddIcon = ({ url, title }: { url: string; title: string }) => (
  <Link href={url}>
    <Tooltip title={title}>
      <AddSquare size={28} style={{ color: 'gray', marginTop: 4 }} />
    </Tooltip>
  </Link>
);

export default AddIcon;
