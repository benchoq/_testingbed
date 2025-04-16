<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import VerticalTabs from "@/comps/VerticalTabs.svelte";
  import {
    FolderOpenOutline,
    FileOutline,
    GridPlusOutline
  } from "flowbite-svelte-icons";

  const items = [
    { label: "Project", icon: FolderOpenOutline },
    { label: "File", icon: FileOutline },
    { label: "Class", icon: GridPlusOutline },
  ];

</script>

<VerticalTabs {items}/>
