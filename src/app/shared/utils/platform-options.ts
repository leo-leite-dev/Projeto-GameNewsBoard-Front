import { PlatformFamily } from '../enums/platform.enum';
import { faGamepad, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { faPlaystation, faSteam, faXbox } from '@fortawesome/free-brands-svg-icons';

export const PLATFORM_FILTER_OPTIONS = [
    { value: PlatformFamily.All, icon: faLayerGroup, label: 'Todos', key: 'todos' },
    { value: PlatformFamily.FamilyXbox, icon: faXbox, label: 'Xbox', key: 'xbox' },
    { value: PlatformFamily.FamilyPlaystation, icon: faPlaystation, label: 'PlayStation', key: 'playstation' },
    { value: PlatformFamily.FamilyMicrosoft, icon: faSteam, label: 'PCMicrosoftWindows', key: 'steam' },
    { value: PlatformFamily.FamilyNintendo, icon: faGamepad, label: 'Nintendo', key: 'nintendo' },
];