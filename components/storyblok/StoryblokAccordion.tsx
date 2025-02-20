import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Icon,
  Typography,
} from '@mui/material';
import { storyblokEditable } from '@storyblok/react';
import Image from 'next/image';
import { render } from 'storyblok-rich-text-react-renderer';
import { ACCORDION_OPENED, generateAccordionEvent } from '../../constants/events';
import { useTypedSelector } from '../../hooks/store';
import logEvent, { getEventUserData } from '../../utils/logEvent';
import { RichTextOptions } from '../../utils/richText';

const containerStyle = {
  width: '100%',
  maxWidth: 725,
  marginBottom: 5,
} as const;

const accordionDetail = {
  textAlign: 'left',
} as const;

const themes = {
  primary: {}, // uses default styling
  secondary: {
    '& .MuiAccordionSummary-expandIconWrapper': { color: 'primary.dark' },
    backgroundColor: 'paleSecondaryLight',
  },
};

interface StoryblokAccordionItemProps {
  _uid: string;
  _editable: string;
  body: any;
  title: string;
  title_size: 'small' | 'large';
  icon: { filename: string; alt: string };
}
interface StoryblokAccordionProps {
  _uid: string;
  _editable: string;
  accordion_items: Array<StoryblokAccordionItemProps>;
  theme: 'primary' | 'secondary';
}
const StoryblokAccordion = (props: StoryblokAccordionProps) => {
  const { _uid, _editable, accordion_items, theme } = props;
  const userCreatedAt = useTypedSelector((state) => state.user.createdAt);
  const partnerAccesses = useTypedSelector((state) => state.partnerAccesses);
  const partnerAdmin = useTypedSelector((state) => state.partnerAdmin);
  const eventUserData = getEventUserData(userCreatedAt, partnerAccesses, partnerAdmin);

  const handleChange =
    (accordionTitle: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      if (isExpanded) {
        logEvent(ACCORDION_OPENED, { accordionTitle: accordionTitle, ...eventUserData });
        logEvent(generateAccordionEvent(accordionTitle), {
          accordionTitle: accordionTitle,
          ...eventUserData,
        });
      }
    };
  return (
    <Box sx={containerStyle} {...storyblokEditable({ _uid, _editable, accordion_items, theme })}>
      {accordion_items.map((ai, i) => (
        <Accordion key={`panel${i}`} onChange={handleChange(ai.title)} sx={themes[theme]}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${i}-content`}
            id={`panel${i}-header`}
          >
            {ai.icon?.filename && (
              <Icon
                sx={{
                  position: 'relative',
                  fontSize: 32,
                  marginBottom: 0,
                  marginRight: 2,
                }}
              >
                <Image
                  alt={ai.icon.alt}
                  src={ai.icon.filename}
                  fill
                  sizes="100vw"
                  style={{
                    objectFit: 'contain',
                  }}
                />
              </Icon>
            )}
            {
              <Typography
                sx={{ marginBottom: 0, maxWidth: 800 }}
                component="h3"
                variant={ai.title_size === 'small' ? 'body1' : 'h3'}
                textAlign="left"
              >
                {ai.title}
              </Typography>
            }
          </AccordionSummary>
          <AccordionDetails sx={accordionDetail}>
            {render(ai.body, RichTextOptions)}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default StoryblokAccordion;
