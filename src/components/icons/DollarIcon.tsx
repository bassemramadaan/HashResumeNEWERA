import React from 'react';
import { DollarSign } from 'lucide-react';

export const DollarIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <DollarSign className={className} {...props} />
);
