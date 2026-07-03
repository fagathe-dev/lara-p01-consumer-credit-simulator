/**
 * Design System Components Showcase
 * Demonstration of all UI components with usage examples
 *
 * This file is meant for development and documentation purposes.
 * It shows how to use each component with the design tokens.
 */

import React, { useState } from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";
import {
    Button,
    Badge,
    Card,
    Input,
    MoneyInput,
    Select,
    Alert,
    Table,
    Tabs,
    Avatar,
    Divider,
    Skeleton,
    Checkbox,
    Radio,
    Switch,
    Tooltip,
    Pagination,
    // Base
    Icon,
    Spinner,
    // Typography
    Text,
    Title,
    Link,
    Code,
    Label,
    // Forms
    Field,
    FormGroup,
    SelectableCard,
    SelectableCardList,
    SelectableAutocomplete,
    // Layout
    Container,
    Grid,
    Row,
    Col,
    Stack,
    Flex,
    Spacer,
    // Table
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    EmptyState,
    // Media
    Image,
    Figure,
    // Feedback
    Loader,
    Toast,
    ToastContainer,
    // Navigation
    ProgressSteps,
    ProgressBar,
    Breadcrumb,
    Menu,
    // Widgets
    Modal,
    Drawer,
    Accordion,
    Popover,
} from "@/ui/components";

/** Small inline SVG icons used purely for the showcase examples. */
const HomeGlyph = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
            d="M3 11l9-8 9 8M5 10v10h14V10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
    </svg>
);

const CarGlyph = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
            d="M3 13l2-5h14l2 5v5H3v-5zM6 18v2M18 18v2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
    </svg>
);

const StarGlyph = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
            d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8L6.6 19.6l1-6L3.3 9.4l6-.9L12 3z"
            fill="currentColor"
        />
    </svg>
);

/** Placeholder image (inline SVG data URI) to avoid external requests. */
const PLACEHOLDER_IMG =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(
        "<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180'>" +
            "<rect width='100%' height='100%' fill='#E2E8F0'/>" +
            "<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' " +
            "fill='#64748B' font-family='sans-serif' font-size='16'>320 × 180</text></svg>",
    );

const ComponentGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: ${theme.spacing[6]};
    padding: ${theme.spacing[6]};
`;

const ComponentSection = styled.section`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing[3]};
`;

const SectionTitle = styled.h2`
    font-size: ${theme.typography.fontSize["2xl"]};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing[2]};
`;

const ExampleBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing[3]};
    padding: ${theme.spacing[4]};
    background-color: ${theme.colors.background.surface};
    border-radius: ${theme.radius.lg};
    border: 1px solid ${theme.colors.border.default};
`;

const ExampleLabel = styled.p`
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.medium};
    color: ${theme.colors.text.secondary};
`;

/**
 * Design System Showcase Component
 * Shows all available components with their variants
 */
export const DesignSystemShowcase: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState("buttons");
    const [currentPage, setCurrentPage] = useState(1);
    const [isChecked, setIsChecked] = useState(false);
    const [isRadio, setIsRadio] = useState("option1");
    const [isSwitch, setIsSwitch] = useState(false);
    const [selectedCard, setSelectedCard] = useState("auto");
    const [selectedRow, setSelectedRow] = useState("rachat");
    const [city, setCity] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const cityOptions = [
        { label: "Paris (75001)", value: "paris" },
        { label: "Lyon (69001)", value: "lyon" },
        { label: "Marseille (13001)", value: "marseille" },
        { label: "Bordeaux (33000)", value: "bordeaux" },
        { label: "Lille (59000)", value: "lille" },
    ];

    const tableData = [
        { id: 1, name: "John Doe", amount: 1500, status: "success" },
        { id: 2, name: "Jane Smith", amount: 2500, status: "warning" },
        { id: 3, name: "Bob Johnson", amount: 1200, status: "danger" },
    ];

    return (
        <div>
            <ComponentGrid>
                {/* BUTTONS */}
                <ComponentSection>
                    <SectionTitle>Buttons</SectionTitle>

                    <ExampleBlock>
                        <ExampleLabel>Primary</ExampleLabel>
                        <div
                            style={{
                                display: "flex",
                                gap: theme.spacing[2],
                                flexWrap: "wrap",
                            }}
                        >
                            <Button variant="primary" size="sm">
                                Small
                            </Button>
                            <Button variant="primary" size="md">
                                Medium
                            </Button>
                            <Button variant="primary" size="lg">
                                Large
                            </Button>
                        </div>
                    </ExampleBlock>

                    <ExampleBlock>
                        <ExampleLabel>Secondary</ExampleLabel>
                        <div
                            style={{
                                display: "flex",
                                gap: theme.spacing[2],
                                flexWrap: "wrap",
                            }}
                        >
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="danger">Danger</Button>
                        </div>
                    </ExampleBlock>

                    <ExampleBlock>
                        <ExampleLabel>Loading State</ExampleLabel>
                        <Button variant="primary" isLoading>
                            Loading...
                        </Button>
                    </ExampleBlock>
                </ComponentSection>

                {/* BADGES */}
                <ComponentSection>
                    <SectionTitle>Badges</SectionTitle>

                    <ExampleBlock>
                        <ExampleLabel>Status Badges</ExampleLabel>
                        <div
                            style={{
                                display: "flex",
                                gap: theme.spacing[2],
                                flexWrap: "wrap",
                            }}
                        >
                            <Badge variant="status" status="success">
                                Accepté
                            </Badge>
                            <Badge variant="status" status="warning">
                                En cours
                            </Badge>
                            <Badge variant="status" status="danger">
                                Refusé
                            </Badge>
                            <Badge variant="status" status="info">
                                Nouveau
                            </Badge>
                        </div>
                    </ExampleBlock>

                    <ExampleBlock>
                        <ExampleLabel>Custom Tag Badges</ExampleLabel>
                        <div
                            style={{
                                display: "flex",
                                gap: theme.spacing[2],
                                flexWrap: "wrap",
                            }}
                        >
                            <Badge
                                variant="custom"
                                bgColor="#E8D5F2"
                                textColor="#5C3E67"
                            >
                                VIP
                            </Badge>
                            <Badge
                                variant="custom"
                                bgColor="#FFE4E4"
                                textColor="#8B0000"
                            >
                                Urgent
                            </Badge>
                            <Badge
                                variant="custom"
                                bgColor="#E4F0FF"
                                textColor="#003399"
                            >
                                Premium
                            </Badge>
                        </div>
                    </ExampleBlock>
                </ComponentSection>

                {/* CARDS */}
                <ComponentSection>
                    <SectionTitle>Cards</SectionTitle>

                    <Card variant="default">
                        <Card.Header>Default Card</Card.Header>
                        <Card.Body>
                            This is a default card with border.
                        </Card.Body>
                    </Card>

                    <Card variant="elevated">
                        <Card.Header>Elevated Card</Card.Header>
                        <Card.Body>
                            This card has a subtle shadow for depth.
                        </Card.Body>
                        <Card.Footer>
                            <Button variant="primary" size="sm">
                                Action
                            </Button>
                        </Card.Footer>
                    </Card>
                </ComponentSection>

                {/* FORM INPUTS */}
                <ComponentSection>
                    <SectionTitle>Form Inputs</SectionTitle>

                    <ExampleBlock>
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="user@example.com"
                        />
                    </ExampleBlock>

                    <ExampleBlock>
                        <Input
                            label="With Error"
                            error="This field is required"
                            type="text"
                        />
                    </ExampleBlock>

                    <ExampleBlock>
                        <MoneyInput
                            label="Monthly Payment"
                            currency="€"
                            placeholder="0,00"
                        />
                    </ExampleBlock>

                    <ExampleBlock>
                        <Select
                            label="Choose Status"
                            options={[
                                { value: "pending", label: "Pending" },
                                { value: "approved", label: "Approved" },
                                { value: "rejected", label: "Rejected" },
                            ]}
                        />
                    </ExampleBlock>
                </ComponentSection>

                {/* ALERTS */}
                <ComponentSection>
                    <SectionTitle>Alerts</SectionTitle>

                    <ExampleBlock>
                        <Alert type="success" title="Success!" closeable>
                            Your changes have been saved successfully.
                        </Alert>
                    </ExampleBlock>

                    <ExampleBlock>
                        <Alert type="warning" title="Warning">
                            Please review your information before submitting.
                        </Alert>
                    </ExampleBlock>

                    <ExampleBlock>
                        <Alert type="danger" title="Error" closeable>
                            An error occurred while processing your request.
                        </Alert>
                    </ExampleBlock>

                    <ExampleBlock>
                        <Alert type="info">
                            This is an informational message.
                        </Alert>
                    </ExampleBlock>
                </ComponentSection>

                {/* FORM CONTROLS */}
                <ComponentSection>
                    <SectionTitle>Form Controls</SectionTitle>

                    <ExampleBlock>
                        <Checkbox
                            label="I agree to terms"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                        />
                    </ExampleBlock>

                    <ExampleBlock>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: theme.spacing[2],
                            }}
                        >
                            <Radio
                                name="options"
                                value="option1"
                                label="Option 1"
                                checked={isRadio === "option1"}
                                onChange={(e) => setIsRadio(e.target.value)}
                            />
                            <Radio
                                name="options"
                                value="option2"
                                label="Option 2"
                                checked={isRadio === "option2"}
                                onChange={(e) => setIsRadio(e.target.value)}
                            />
                        </div>
                    </ExampleBlock>

                    <ExampleBlock>
                        <Switch
                            label="Enable notifications"
                            checked={isSwitch}
                            onChange={(e) => setIsSwitch(e.target.checked)}
                        />
                    </ExampleBlock>
                </ComponentSection>

                {/* AVATARS */}
                <ComponentSection>
                    <SectionTitle>Avatars</SectionTitle>

                    <ExampleBlock>
                        <div
                            style={{
                                display: "flex",
                                gap: theme.spacing[3],
                                alignItems: "center",
                            }}
                        >
                            <Avatar name="John Doe" size="sm" />
                            <Avatar name="Jane Smith" size="md" />
                            <Avatar name="Bob Johnson" size="lg" />
                            <Avatar name="Alice Brown" size="xl" />
                        </div>
                    </ExampleBlock>
                </ComponentSection>

                {/* DIVIDERS */}
                <ComponentSection>
                    <SectionTitle>Dividers</SectionTitle>

                    <ExampleBlock>
                        <div>Content Above</div>
                        <Divider />
                        <div>Content Below</div>
                    </ExampleBlock>
                </ComponentSection>

                {/* SKELETONS */}
                <ComponentSection>
                    <SectionTitle>Skeletons (Loading)</SectionTitle>

                    <ExampleBlock>
                        <ExampleLabel>Text Skeleton</ExampleLabel>
                        <Skeleton shape="text" count={3} />
                    </ExampleBlock>

                    <ExampleBlock>
                        <ExampleLabel>Circle Skeleton</ExampleLabel>
                        <Skeleton shape="circle" />
                    </ExampleBlock>

                    <ExampleBlock>
                        <ExampleLabel>Rect Skeleton</ExampleLabel>
                        <Skeleton shape="rect" count={2} />
                    </ExampleBlock>
                </ComponentSection>

                {/* TOOLTIPS */}
                <ComponentSection>
                    <SectionTitle>Tooltips</SectionTitle>

                    <ExampleBlock>
                        <div style={{ display: "flex", gap: theme.spacing[4] }}>
                            <Tooltip content="Help text here" position="top">
                                <Button variant="outline" size="sm">
                                    Hover me (top)
                                </Button>
                            </Tooltip>
                            <Tooltip
                                content="Another tooltip"
                                position="bottom"
                            >
                                <Button variant="outline" size="sm">
                                    Hover me (bottom)
                                </Button>
                            </Tooltip>
                        </div>
                    </ExampleBlock>
                </ComponentSection>

                {/* PAGINATION */}
                <ComponentSection>
                    <SectionTitle>Pagination</SectionTitle>

                    <ExampleBlock>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={10}
                            onPageChange={setCurrentPage}
                        />
                    </ExampleBlock>
                </ComponentSection>

                {/* TABS */}
                <ComponentSection>
                    <SectionTitle>Tabs</SectionTitle>

                    <ExampleBlock>
                        <Tabs
                            variant="default"
                            items={[
                                {
                                    id: "overview",
                                    label: "Overview",
                                    content: <div>Overview content...</div>,
                                },
                                {
                                    id: "details",
                                    label: "Details",
                                    content: <div>Details content...</div>,
                                },
                                {
                                    id: "settings",
                                    label: "Settings",
                                    content: <div>Settings content...</div>,
                                },
                            ]}
                        />
                    </ExampleBlock>

                    <ExampleBlock>
                        <Tabs
                            variant="pills"
                            items={[
                                {
                                    id: "tab1",
                                    label: "Tab 1",
                                    content: <div>Tab 1 content...</div>,
                                },
                                {
                                    id: "tab2",
                                    label: "Tab 2",
                                    content: <div>Tab 2 content...</div>,
                                },
                            ]}
                        />
                    </ExampleBlock>
                </ComponentSection>

                {/* TABLE */}
                <ComponentSection style={{ gridColumn: "1 / -1" }}>
                    <SectionTitle>Table</SectionTitle>

                    <ExampleBlock style={{ overflow: "auto" }}>
                        <Table
                            columns={[
                                { key: "name", label: "Name" },
                                {
                                    key: "amount",
                                    label: "Amount",
                                    numeric: true,
                                },
                                { key: "status", label: "Status" },
                            ]}
                            data={tableData.map((row) => ({
                                ...row,
                                status: (
                                    <Badge
                                        variant="status"
                                        status={row.status as any}
                                    >
                                        {row.status}
                                    </Badge>
                                ),
                            }))}
                        />
                    </ExampleBlock>
                </ComponentSection>

                {/* TYPOGRAPHY */}
                <ComponentSection>
                    <SectionTitle>Typography</SectionTitle>

                    <ExampleBlock>
                        <ExampleLabel>Titles</ExampleLabel>
                        <Title level={1}>Titre H1</Title>
                        <Title level={2}>Titre H2</Title>
                        <Title level={3}>Titre H3</Title>
                    </ExampleBlock>

                    <ExampleBlock>
                        <ExampleLabel>Text tones</ExampleLabel>
                        <Text>Texte primaire</Text>
                        <Text tone="secondary">Texte secondaire</Text>
                        <Text tone="muted">Texte atténué</Text>
                        <Text tabular weight="semibold">
                            1 500,00 €
                        </Text>
                    </ExampleBlock>

                    <ExampleBlock>
                        <ExampleLabel>Link, Code & Label</ExampleLabel>
                        <div>
                            <Link href="#">Lien par défaut</Link>{" "}
                            <Link href="https://example.com" external>
                                Lien externe
                            </Link>
                        </div>
                        <Code>npm run build</Code>
                        <Code
                            block
                        >{`const taeg = 4.2;\nconst mensualite = 199.9;`}</Code>
                        <Label htmlFor="demo-label" required>
                            Champ obligatoire
                        </Label>
                    </ExampleBlock>
                </ComponentSection>

                {/* ICONS & SPINNER */}
                <ComponentSection>
                    <SectionTitle>Icons & Spinner</SectionTitle>

                    <ExampleBlock>
                        <ExampleLabel>Icon sizes & colors</ExampleLabel>
                        <Flex align="center" gap={4}>
                            <Icon size="sm">
                                <HomeGlyph />
                            </Icon>
                            <Icon size="md">
                                <HomeGlyph />
                            </Icon>
                            <Icon size="lg" color={theme.colors.brand.primary}>
                                <StarGlyph />
                            </Icon>
                            <Icon size={40} color={theme.colors.success[600]}>
                                <CarGlyph />
                            </Icon>
                        </Flex>
                    </ExampleBlock>

                    <ExampleBlock>
                        <ExampleLabel>Spinner</ExampleLabel>
                        <Flex align="center" gap={4}>
                            <Spinner size="sm" />
                            <Spinner size="md" />
                            <Spinner size="lg" />
                        </Flex>
                    </ExampleBlock>
                </ComponentSection>

                {/* LAYOUT */}
                <ComponentSection>
                    <SectionTitle>Layout</SectionTitle>

                    <ExampleBlock>
                        <ExampleLabel>Grid (3 columns)</ExampleLabel>
                        <Grid columns={3} gap={3} collapseBelow="480px">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <Card key={n} variant="bordered">
                                    <Card.Body>Cell {n}</Card.Body>
                                </Card>
                            ))}
                        </Grid>
                    </ExampleBlock>

                    <ExampleBlock>
                        <ExampleLabel>Row / Col (12-grid)</ExampleLabel>
                        <Row gap={3}>
                            <Col span={8}>
                                <Card variant="bordered">
                                    <Card.Body>span 8</Card.Body>
                                </Card>
                            </Col>
                            <Col span={4}>
                                <Card variant="bordered">
                                    <Card.Body>span 4</Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </ExampleBlock>

                    <ExampleBlock>
                        <ExampleLabel>Stack, Flex & Spacer</ExampleLabel>
                        <Stack gap={2}>
                            <Text>Élément empilé 1</Text>
                            <Text>Élément empilé 2</Text>
                        </Stack>
                        <Flex align="center">
                            <Text>Gauche</Text>
                            <Spacer grow />
                            <Badge variant="status" status="info">
                                Droite
                            </Badge>
                        </Flex>
                    </ExampleBlock>
                </ComponentSection>

                {/* FORM COMPOSITION */}
                <ComponentSection>
                    <SectionTitle>Form Composition</SectionTitle>

                    <ExampleBlock>
                        <FormGroup
                            legend="Coordonnées"
                            description="Renseignez vos informations de contact"
                        >
                            <Field htmlFor="fc-nom" label="Nom" required>
                                <Input id="fc-nom" placeholder="Dupont" />
                            </Field>
                            <Field
                                htmlFor="fc-email"
                                label="Email"
                                hint="Nous ne partagerons jamais votre email."
                            >
                                <Input
                                    id="fc-email"
                                    type="email"
                                    placeholder="user@example.com"
                                />
                            </Field>
                            <Field
                                htmlFor="fc-tel"
                                label="Téléphone"
                                error="Numéro invalide"
                            >
                                <Input
                                    id="fc-tel"
                                    aria-describedby="fc-tel-error"
                                />
                            </Field>
                        </FormGroup>
                    </ExampleBlock>
                </ComponentSection>

                {/* SELECTABLE INPUTS */}
                <ComponentSection>
                    <SectionTitle>Selectable Inputs</SectionTitle>

                    <ExampleBlock>
                        <ExampleLabel>
                            SelectableCard (card variant)
                        </ExampleLabel>
                        <Grid columns={3} gap={3} collapseBelow="480px">
                            <SelectableCard
                                label="Auto"
                                icon={<CarGlyph />}
                                selected={selectedCard === "auto"}
                                onSelect={() => setSelectedCard("auto")}
                            />
                            <SelectableCard
                                label="Maison"
                                icon={<HomeGlyph />}
                                selected={selectedCard === "maison"}
                                onSelect={() => setSelectedCard("maison")}
                            />
                            <SelectableCard
                                label="Loisirs"
                                icon={<StarGlyph />}
                                selected={selectedCard === "loisirs"}
                                onSelect={() => setSelectedCard("loisirs")}
                            />
                        </Grid>
                    </ExampleBlock>

                    <ExampleBlock>
                        <ExampleLabel>
                            SelectableCardList (list variant)
                        </ExampleLabel>
                        <Stack gap={2}>
                            <SelectableCardList
                                label="Rachat de crédits"
                                selected={selectedRow === "rachat"}
                                onSelect={() => setSelectedRow("rachat")}
                            />
                            <SelectableCardList
                                label="Prêt personnel"
                                selected={selectedRow === "perso"}
                                onSelect={() => setSelectedRow("perso")}
                            />
                            <SelectableCardList
                                label="Crédit renouvelable"
                                selected={selectedRow === "renouvelable"}
                                onSelect={() => setSelectedRow("renouvelable")}
                            />
                        </Stack>
                    </ExampleBlock>

                    <ExampleBlock>
                        <ExampleLabel>SelectableAutocomplete</ExampleLabel>
                        <SelectableAutocomplete
                            label="Ville ou code postal"
                            placeholder="Commencez à taper…"
                            sectionLabel="Sélectionnez votre ville :"
                            value={city}
                            onChange={setCity}
                            options={cityOptions}
                        />
                    </ExampleBlock>
                </ComponentSection>

                {/* PROGRESS */}
                <ComponentSection>
                    <SectionTitle>Progress</SectionTitle>

                    <ExampleBlock>
                        <ExampleLabel>ProgressSteps</ExampleLabel>
                        <ProgressSteps
                            sections={[
                                {
                                    key: "projet",
                                    label: "Votre projet",
                                    status: "done",
                                },
                                {
                                    key: "situation",
                                    label: "Votre situation",
                                    status: "current",
                                },
                                {
                                    key: "finances",
                                    label: "Situation financière",
                                    status: "upcoming",
                                },
                                {
                                    key: "profil",
                                    label: "Votre profil",
                                    status: "upcoming",
                                },
                            ]}
                        />
                    </ExampleBlock>

                    <ExampleBlock>
                        <ExampleLabel>ProgressBar</ExampleLabel>
                        <ProgressBar value={40} label="Étape 2 sur 5" />
                    </ExampleBlock>
                </ComponentSection>

                {/* BREADCRUMB & MENU */}
                <ComponentSection>
                    <SectionTitle>Breadcrumb & Menu</SectionTitle>

                    <ExampleBlock>
                        <ExampleLabel>Breadcrumb</ExampleLabel>
                        <Breadcrumb
                            items={[
                                { label: "Accueil", href: "#" },
                                { label: "Dossiers", href: "#" },
                                { label: "Dossier #42" },
                            ]}
                        />
                    </ExampleBlock>

                    <ExampleBlock>
                        <ExampleLabel>Menu</ExampleLabel>
                        <Menu>
                            <Menu.Item
                                active
                                icon={
                                    <Icon size="sm">
                                        <HomeGlyph />
                                    </Icon>
                                }
                            >
                                Pipeline
                            </Menu.Item>
                            <Menu.Item
                                icon={
                                    <Icon size="sm">
                                        <StarGlyph />
                                    </Icon>
                                }
                            >
                                Favoris
                            </Menu.Item>
                            <Menu.Item disabled>Paramètres</Menu.Item>
                        </Menu>
                    </ExampleBlock>
                </ComponentSection>

                {/* MEDIA */}
                <ComponentSection>
                    <SectionTitle>Media</SectionTitle>

                    <ExampleBlock>
                        <ExampleLabel>Image</ExampleLabel>
                        <Image
                            src={PLACEHOLDER_IMG}
                            alt="Exemple"
                            ratio="16 / 9"
                            radius="lg"
                        />
                    </ExampleBlock>

                    <ExampleBlock>
                        <ExampleLabel>Figure</ExampleLabel>
                        <Figure caption="Répartition des mensualités">
                            <Image
                                src={PLACEHOLDER_IMG}
                                alt="Graphique"
                                radius="md"
                            />
                        </Figure>
                    </ExampleBlock>
                </ComponentSection>

                {/* LOADER & TOAST */}
                <ComponentSection>
                    <SectionTitle>Loader & Toast</SectionTitle>

                    <ExampleBlock>
                        <ExampleLabel>Loader</ExampleLabel>
                        <Loader label="Chargement des dossiers…" center />
                    </ExampleBlock>

                    <ExampleBlock>
                        <ExampleLabel>Toast</ExampleLabel>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowToast(true)}
                        >
                            Afficher un toast
                        </Button>
                        {showToast && (
                            <ToastContainer position="top-right">
                                <Toast
                                    type="success"
                                    title="Dossier enregistré"
                                    onClose={() => setShowToast(false)}
                                >
                                    Vos modifications ont été sauvegardées.
                                </Toast>
                            </ToastContainer>
                        )}
                    </ExampleBlock>
                </ComponentSection>

                {/* OVERLAYS & ACCORDION */}
                <ComponentSection>
                    <SectionTitle>Overlays & Accordion</SectionTitle>

                    <ExampleBlock>
                        <ExampleLabel>Modal / Drawer</ExampleLabel>
                        <Flex gap={3} wrap="wrap">
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Ouvrir Modal
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsDrawerOpen(true)}
                            >
                                Ouvrir Drawer
                            </Button>
                        </Flex>
                        <Modal
                            open={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            title="Confirmation"
                            footer={
                                <>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Confirmer
                                    </Button>
                                </>
                            }
                        >
                            Êtes-vous sûr de vouloir valider cette simulation ?
                        </Modal>
                        <Drawer
                            open={isDrawerOpen}
                            onClose={() => setIsDrawerOpen(false)}
                            title="Filtres"
                            side="right"
                        >
                            <Stack gap={4}>
                                <Checkbox label="Acceptés" />
                                <Checkbox label="En cours" />
                                <Checkbox label="Refusés" />
                            </Stack>
                        </Drawer>
                    </ExampleBlock>

                    <ExampleBlock>
                        <ExampleLabel>Popover</ExampleLabel>
                        <Popover
                            placement="bottom"
                            trigger={
                                <Button variant="outline" size="sm">
                                    Options
                                </Button>
                            }
                        >
                            <Menu>
                                <Menu.Item>Modifier</Menu.Item>
                                <Menu.Item>Dupliquer</Menu.Item>
                            </Menu>
                        </Popover>
                    </ExampleBlock>

                    <ExampleBlock>
                        <ExampleLabel>Accordion</ExampleLabel>
                        <Accordion
                            items={[
                                {
                                    id: "faq1",
                                    title: "Qu'est-ce que le TAEG ?",
                                    content: (
                                        <Text tone="secondary">
                                            Le Taux Annuel Effectif Global
                                            représente le coût total du crédit.
                                        </Text>
                                    ),
                                },
                                {
                                    id: "faq2",
                                    title: "Puis-je rembourser par anticipation ?",
                                    content: (
                                        <Text tone="secondary">
                                            Oui, sous conditions prévues au
                                            contrat.
                                        </Text>
                                    ),
                                },
                            ]}
                        />
                    </ExampleBlock>
                </ComponentSection>

                {/* COMPOSABLE TABLE & EMPTY STATE */}
                <ComponentSection style={{ gridColumn: "1 / -1" }}>
                    <SectionTitle>Table (composable) & EmptyState</SectionTitle>

                    <ExampleBlock style={{ overflow: "auto" }}>
                        <ExampleLabel>Composable primitives</ExampleLabel>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                            }}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell header>Client</TableCell>
                                    <TableCell header numeric>
                                        Montant
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow clickable>
                                    <TableCell>John Doe</TableCell>
                                    <TableCell numeric>1 500,00 €</TableCell>
                                </TableRow>
                                <TableRow clickable>
                                    <TableCell>Jane Smith</TableCell>
                                    <TableCell numeric>2 500,00 €</TableCell>
                                </TableRow>
                            </TableBody>
                        </table>
                    </ExampleBlock>

                    <ExampleBlock>
                        <ExampleLabel>EmptyState</ExampleLabel>
                        <EmptyState
                            icon={
                                <Icon size="xl">
                                    <StarGlyph />
                                </Icon>
                            }
                            title="Aucun dossier"
                            description="Créez votre premier dossier pour démarrer une simulation."
                            action={
                                <Button variant="primary" size="sm">
                                    Nouveau dossier
                                </Button>
                            }
                        />
                    </ExampleBlock>
                </ComponentSection>
            </ComponentGrid>
        </div>
    );
};

export default DesignSystemShowcase;
