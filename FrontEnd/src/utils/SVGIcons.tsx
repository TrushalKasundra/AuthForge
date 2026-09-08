import PlusOutlined from '@assets/icons/PlusOutlined.svg?react';
import Correct from '@assets/icons/correctIcon.svg?react';
import Github from '@assets/icons/github.svg?react';
import Google from '@assets/icons/google.svg?react';
import type React from 'react';

const Icons = {
  plusOutlined: PlusOutlined,
  github: Github,
  google: Google,
  correct: Correct
} as const;

export { Icons };
export type IconName = keyof typeof Icons;

interface SVGIconProps extends React.SVGProps<SVGSVGElement> {
  icon: IconName;
  color?: string;
  size?: number;
  className?: string;
  fallbackIcon?: IconName;
}

const SVGIcons: React.FC<SVGIconProps> = ({
  icon,
  color,
  size,
  fallbackIcon = 'plusOutlined',
  className,
  style,
  ...rest
}) => {
  const IconComponent = Icons[icon] ?? Icons[fallbackIcon];
  if (!IconComponent) return null;
  
  const sizeStyle = size ? { width: size, height: size, minWidth: size } : {};
  
  return (
    <IconComponent
      className={className}
      style={{ ...(color ? { color } : {}), ...sizeStyle, ...style }}
      {...rest}
    />
  );
};

export default SVGIcons;
