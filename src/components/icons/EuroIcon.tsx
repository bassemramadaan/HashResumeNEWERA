import React from 'react';
import { Euro } from 'lucide-react';

export const EuroIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <Euro className={className} {...props} />
);
