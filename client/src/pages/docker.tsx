import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import DockerContainerTable from "@/components/docker/container-table";
import DockerImageTable from "@/components/docker/image-table";
import DockerfileTable from "@/components/docker/dockerfile-table";

const DockerPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Docker Management</h1>
      </div>

      <Tabs defaultValue="containers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="containers">Containers</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="dockerfiles">Dockerfiles</TabsTrigger>
        </TabsList>

        <TabsContent value="containers">
          <Card>
            <DockerContainerTable />
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <DockerImageTable />
          </Card>
        </TabsContent>

        <TabsContent value="dockerfiles">
          <Card>
            <DockerfileTable />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DockerPage;
