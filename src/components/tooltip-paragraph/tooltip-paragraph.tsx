import React, { useState } from 'react';
import Paragraph, { ParagraphProps } from 'antd/es/typography/Paragraph';
import { Tooltip } from 'antd';
import { EllipsisConfig } from 'antd/es/typography/Base';

const TooltipParagraph: React.FC<ParagraphProps> = ({
  children,
  ellipsis,
  ...props
}) => {
  const [truncated, setTruncated] = useState(false);

  return (
    <Tooltip title={truncated ? children : undefined}>
      <Paragraph
        {...props}
        ellipsis={{
          ...(ellipsis as EllipsisConfig),
          onEllipsis: setTruncated
        }}>
        {/* NOTE: Fragment is necessary to avoid showing the title */}
        <>{children}</>
      </Paragraph>
    </Tooltip>
  );
};

export default TooltipParagraph;
