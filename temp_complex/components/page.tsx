import Button from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";

export default function ComponentsIndex() {
  return (
    <div className="mx-auto grid max-w-screen-xl gap-8 px-4 py-8">
      <h1 className="text-2xl font-bold">Components Preview</h1>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="font-semibold">Buttons</CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="font-semibold">Inputs</CardHeader>
          <CardContent className="grid gap-2">
            <Input placeholder="Placeholder" />
            <Input placeholder="Disabled" disabled />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="font-semibold">Cards</CardHeader>
          <CardContent>Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader className="font-semibold">Table</CardHeader>
          <CardContent>
            <Table>
              <THead>
                <TR>
                  <TH>الاسم</TH>
                  <TH>القناة</TH>
                  <TH>الحالة</TH>
                </TR>
              </THead>
              <TBody>
                {[1, 2, 3].map((i) => (
                  <TR key={i}>
                    <TD>عنصر {i}</TD>
                    <TD>واتساب</TD>
                    <TD>نشط</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
