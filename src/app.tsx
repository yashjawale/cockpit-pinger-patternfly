import React, { useState } from 'react';
import { Alert } from "@patternfly/react-core/dist/esm/components/Alert/index.js";
import { Card, CardBody, CardTitle } from "@patternfly/react-core/dist/esm/components/Card/index.js";
import { Page, PageSection } from "@patternfly/react-core/dist/esm/components/Page/index.js";

import cockpit from 'cockpit';
import { Button } from '@patternfly/react-core/dist/esm/components/Button';
import { Divider } from '@patternfly/react-core/dist/esm/components/Divider';
import { CodeBlock, CodeBlockCode } from '@patternfly/react-core/dist/esm/components/CodeBlock';
import { TextInput } from '@patternfly/react-core';
import { Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core/dist/esm/components/Toolbar';
import { GlobeIcon } from '@patternfly/react-icons/dist/esm/icons';

const _ = cockpit.gettext;

export const Application = () => {
    const [status, setStatus] = useState < 'idle' | 'success' | 'fail' | 'progress'>('idle');
    const [logs, setLogs] = useState<string[]>([]);
    const [host, setHost] = useState('8.8.8.8');

    const handleHostChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHost(event.target.value ?? '');
    };

    const startPing = () => {
        setStatus('progress');
        setLogs([]);
        cockpit.spawn(["ping", "-c", "4", host])
                .stream((data) => {
                    setLogs(prev => [...prev, data]);
                })
                .then(() => {
                    setStatus('success');
                })
                .catch(() => {
                    setStatus('fail');
                });
    };

    const renderAlert = () => {
        switch (status) {
        case 'success':
            return <Alert variant='success' title={_('Success! You can view more information below.')} />;
        case 'fail':
            return <Alert variant='danger' title={_('Ping failed. Check the logs below for more details.')} />;
        case 'progress':
            return <Alert customIcon={<GlobeIcon />} variant='custom' title={_('Pinging...')} />;
        default:
            return <Alert variant='info' title={_('Start a ping to check connectivity.')} />;
        }
    };

    return (
        <Page className="pf-m-no-sidebar" isContentFilled>
            <Card>
                <CardTitle>{_('Pinger Patternfly')}</CardTitle>
                <CardBody>
                    <PageSection>
                        <p>{_('Check connectivity between two devices by pinging.')}</p>
                    </PageSection>
                    <PageSection>
                        <Toolbar>
                            <ToolbarContent>
                                <ToolbarItem>
                                    <TextInput label='Ping to' isRequired value={host} onChange={handleHostChange} />
                                </ToolbarItem>
                                <ToolbarItem>
                                    <Button disabled={!(status === 'idle')} onClick={startPing}>{_('Ping') }</Button>
                                </ToolbarItem>
                            </ToolbarContent>
                        </Toolbar>
                    </PageSection>
                    <Divider />
                    <PageSection>
                        {renderAlert()}
                    </PageSection>
                    {logs.length > 0 && (
                        <PageSection>
                            <CodeBlock>
                                <CodeBlockCode>
                                    {logs.map((log, index) => <p key={index}>{log}</p>)}
                                </CodeBlockCode>
                            </CodeBlock>
                        </PageSection>
                    )}
                </CardBody>
            </Card>
        </Page>
    );
};
