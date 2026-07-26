import './App.css'
import { Alert, Card, CardBody, CardTitle, Page, PageSection } from '@patternfly/react-core'

function App() {

  return (
    <Page>
      <PageSection>
        <Card>
          <CardTitle>Hello</CardTitle>
          <CardBody>
            <Alert
              title="Hello world"
            />
          </CardBody>
        </Card>
      </PageSection>
    </Page>
  )
}

export default App
